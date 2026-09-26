import {computed, ref} from 'vue'
import {defineStore} from 'pinia'

export type HundredPeopleTeamMember = {
    id: string
    name: string
    avatar: string
}

export type HundredPeoplePlayer = {
    id: string
    name?: string
    points: number
    correct: boolean
    members: HundredPeopleTeamMember[]
}

export type HundredPeopleAnswer = {
    id: string
    text: string
    points: number
    revealed: boolean
}

export type HundredPeopleData = {
    topic: string;
    answers: HundredPeopleAnswer[];
}

export const useHundredPeopleStore = defineStore(
    'hundred-people',
    () => {
        const allData = ref<HundredPeopleData[]>([])
        const currentDataIndex = ref(0)
        const topic = computed(() => allData.value[currentDataIndex.value]?.topic ?? '')
        const showTopic = ref(false)

        const players = ref<HundredPeoplePlayer[]>([ ])

        const answers = computed(() => allData.value[currentDataIndex.value]?.answers ?? [])

        const sortedAnswers = computed(() => [...answers.value].sort((a, b) => b.points - a.points))


        const toggleAnswerReveal = (answerId: string) => {
            const answer = answers.value.find((entry) => entry.id === answerId)
            if (!answer) return
            answer.revealed = !answer.revealed
        }

        const setPlayerPoints = (playerId: string, value: number) => {
            const player = players.value.find((entry) => entry.id === playerId)
            if (!player) return
            player.points = Math.max(0, value)
        }

        const toggleTeamCorrect = (playerId: string) => {
            const player = players.value.find((entry) => entry.id === playerId)
            if (!player) return
            player.correct = !player.correct
        }

        const resetScores = () => {
            players.value = players.value.map((player) => ({...player, points: 0}))
        }

        const resetQuestionVisibility = () => {
            showTopic.value = false
            answers.value.forEach((answer) => {
                answer.revealed = false
            })
            players.value.forEach((player) => {
                player.correct = false
            })
        }

        const setCurrentDataIndex = (index: number) => {
            if (index < 0 || index >= allData.value.length || index === currentDataIndex.value) return
            currentDataIndex.value = index
            resetQuestionVisibility()
        }

        const previousData = () => {
            setCurrentDataIndex(currentDataIndex.value - 1)
        }

        const nextData = () => {
            setCurrentDataIndex(currentDataIndex.value + 1)
        }

        const toggleTopicVisibility = () => {
            showTopic.value = !showTopic.value
        }

        return {
            topic,
            allData,
            currentDataIndex,
            showTopic,
            players,
            answers,
            sortedAnswers,
            toggleAnswerReveal,
            setPlayerPoints,
            toggleTeamCorrect,
            toggleTopicVisibility,
            setCurrentDataIndex,
            previousData,
            nextData,
            resetScores
        }
    },
    {
        share: {
            enable: true
        }
    }
)
