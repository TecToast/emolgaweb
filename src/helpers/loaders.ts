import {useLeagueState} from "../state/pokemon.ts";
import {useRoute} from "vue-router";

export async function leagueload() {
    const league = useLeagueState()
    if(!league.loaded) {
        await league.load()
    }
}

export async function useCurrentLeague() {
    await leagueload()
    const league = useLeagueState()
    const route = useRoute()
    return league.leagues.find(league => league.name === route.params.leaguename)
}

/**
 * Call an async function with a maximum time limit (in milliseconds) for the timeout
 * @param {Promise<any>} asyncPromise An asynchronous promise to resolve
 * @param {number} timeLimit Time limit to attempt function in milliseconds
 * @returns {Promise<any> | undefined} Resolved promise for async function call, or an error if time limit reached
 */
export async function asyncCallWithTimeout<T>(asyncPromise: Promise<T>, timeLimit: number): Promise<T | undefined>  {
    let timeoutHandle: NodeJS.Timeout;

    const timeoutPromise = new Promise((_resolve, reject) => {
        timeoutHandle = setTimeout(
            () => reject(new Error('Async call timeout limit reached')),
            timeLimit
        );
    });

    return Promise.race([asyncPromise, timeoutPromise]).then(result => {
        clearTimeout(timeoutHandle);

        return result ? result as T : undefined;
    })
}
