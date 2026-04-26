import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface DsbUser {
  id: string;
  name: string;
  avatar: string;
  answerText: string | null;
  answerImage: string | null;
  isAnswerRevealed: boolean;
  answerMark: 'correct' | 'incorrect' | null;
  lives: number;
  isActive: boolean;
}

export type InitialDsbUser = Pick<DsbUser, 'id' | 'name' | 'avatar'>

export const useDsbStore = defineStore('dsb', () => {
  const categoryIndex = ref(0);
  const categories = ref<string[]>([]);
  const category = computed(() => categories.value[categoryIndex.value] || '');
  const isCategoryRevealed = ref(false);
  const answerHistory = ref<string[]>([]);

  const users = ref<DsbUser[]>([]);

  const setUsers = (newUsers: InitialDsbUser[]) => {
    users.value = newUsers.map(u => ({
      ...u,
      answerText: null,
      answerImage: null,
      isAnswerRevealed: false,
      answerMark: null,
      lives: 3,
      isActive: true,
    }));
  }

  const setCategories = (newCategories: string[]) => {
    categories.value = newCategories;
    categoryIndex.value = 0;
    isCategoryRevealed.value = false;
    answerHistory.value = [];
  };

  const nextQuestion = (resetAnswers: boolean = true) => {
    if (categoryIndex.value < categories.value.length - 1) {
        categoryIndex.value++;
    }

    isCategoryRevealed.value = false;
    
    if (resetAnswers) {
      users.value.forEach(u => {
        if (u.answerText) {
          const normalized = u.answerText.trim().toLowerCase();
          if (!answerHistory.value.includes(normalized)) {
            answerHistory.value.push(normalized);
          }
        }
        u.answerText = null;
        u.answerImage = null;
        u.isAnswerRevealed = false;
        u.answerMark = null;
      });
    }
  };

  const prevQuestion = (resetAnswers: boolean = false) => {
    if (categoryIndex.value > 0) {
        categoryIndex.value--;
    }

    isCategoryRevealed.value = false;
    
    if (resetAnswers) {
      users.value.forEach(u => {
        u.answerText = null;
        u.answerImage = null;
        u.isAnswerRevealed = false;
        u.answerMark = null;
      });
    }
  };

  const setLives = (id: string, lives: number) => {
    const user = users.value.find(u => u.id === id);
    if (user) user.lives = lives;
  };

  const toggleReveal = (id: string) => {
    const user = users.value.find(u => u.id === id);
    if (user) user.isAnswerRevealed = !user.isAnswerRevealed;
  };

  const togglePlayerActive = (id: string) => {
    const user = users.value.find(u => u.id === id);
    if (user) user.isActive = !user.isActive;
  };

  const setAnswerMark = (id: string, mark: 'correct' | 'incorrect' | null) => {
    const user = users.value.find(u => u.id === id);
    if (user) user.answerMark = mark;
  };

  const toggleCategoryReveal = () => {
    isCategoryRevealed.value = !isCategoryRevealed.value;
  };
  
  const revealAll = () => {
    users.value.forEach(u => u.isAnswerRevealed = true);
  };

  const isDuplicateAnswer = (id: string): boolean => {
    const user = users.value.find(u => u.id === id);
    if (!user || !user.answerText) return false;
    const text = user.answerText.trim().toLowerCase();
    if (answerHistory.value.includes(text)) return true;
    return users.value.some(u => u.id !== id && u.answerText?.trim().toLowerCase() === text);
  };

  const clearAnswerHistory = () => {
    answerHistory.value = [];
  };

  const submitAnswer = (id: string, text: string, image?: string) => {
    const user = users.value.find(u => u.id === id);
    if (user) {
      user.isAnswerRevealed = false;
      user.answerText = text;
      user.answerImage = image ?? null;
      user.answerMark = null; // Reset mark on new submission
    }
  };

  return { category, categoryIndex, categories, isCategoryRevealed, answerHistory, setCategories, setUsers, users, nextQuestion, prevQuestion, setLives, toggleReveal, togglePlayerActive, setAnswerMark, toggleCategoryReveal, revealAll, isDuplicateAnswer, clearAnswerHistory, submitAnswer };
}, {
  share: {
    enable: true
  }
});
