import { Connection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { AccountRepo } from './repo/account';
import { SessionRepo } from './repo/session';
import { UserRepo } from './repo/user';
import { VerificationTokenRepo } from './repo/verification';

export interface SqlHelpers {
    execute: (sql: string, values: any[]) => Promise<ResultSetHeader>;
    query: <T>(sql: string, values: any[]) => Promise<T[]>;
    queryOne: <T>(sql: string, values: any[]) => Promise<T | null>;
}

function replaceUndefined(values: any[]) {
    return values.map(x => {
        if (x === undefined) return null;
        return x;
    })
}

function buildSqlHelpers(getConnection: () => Promise<Connection>) : SqlHelpers {
    const execute = async (sql: string, values: any[]) :Promise<ResultSetHeader> => {
        const replacedValues = replaceUndefined(values);
        const conn = await getConnection();
        try {
            const result = await conn.execute(sql, replacedValues) as ResultSetHeader[];
            return result[0];
        } finally {
            await conn.end();
        }
    }
    
    const query = async <T>(sql: string, values: any[]): Promise<T[]> => {
        const conn = await getConnection();
        try {
            const [rows] = await conn.query<T[] & RowDataPacket[][]>(sql, values);
            return rows;
        }
        finally {
            await conn.end();
        }
    }
    
    const queryOne = async <T>(sql: string, values: any[]): Promise<T | null> => {
        const rows = await query<T>(sql, values);
        if (rows.length == 1) return rows[0];
        return null;
    }

    return {execute, query, queryOne};
}

export function buildUnitOfWork(getConnection: () => Promise<Connection>) {
    const sqlHelpers = buildSqlHelpers(getConnection);

    return {
        users: new UserRepo(sqlHelpers),
        sessions: new SessionRepo(sqlHelpers),
        accounts: new AccountRepo(sqlHelpers),
        verificationTokens: new VerificationTokenRepo(sqlHelpers),
        raw: sqlHelpers
    }
}
