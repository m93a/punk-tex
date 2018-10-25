import state from "./state";

namespace Session {
    interface FetchOptions {
        noJson: boolean;
        token?: Token;
    }

    export async function fetchObject<T = any>(
        endpoint: string,
        method: HttpMethod,
        body?: any,
        options?: Partial<FetchOptions>
    ): Promise<T> {
        options = options || {};
        const headers: any = {};

        const token = options.token || state.token;
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        headers['Content-Type'] = 'application/json';

        const result = await fetch(endpoint, {
            method: method as string,
            headers,
            body: method === 'GET' ? body : JSON.stringify(body),
            // cache: 'no-cache',
            // credentials: 'same-origin',
        });

        if (!result.ok) {
            throw new Error(await result.text());
        }

        const text = await result.text();
        if (options.noJson) {
            return text as any;
        } else {
            return JSON.parse(text);
        }
    }

    export async function getToken(email: string, password: string): Promise<Token> {
        const login = await fetchObject<{ token: string }>(
            '/api/login',
            'POST',
            {
                email,
                password,
            }
        );

        return login.token;
    }

    export async function refreshToken(token: Token): Promise<Token> {
        const login = await fetchObject<{ token: string }>(
            '/api/login',
            'GET',
            undefined,
            {
                token,
            }
        );

        return login.token;
    }
}

export default Session;