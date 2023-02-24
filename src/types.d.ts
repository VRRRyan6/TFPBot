import { Collection, Interaction } from 'discord.js'

export interface Command {
    name: string,
    execute: (arg0: Interaction) => void
}

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, Command>
    }
}
