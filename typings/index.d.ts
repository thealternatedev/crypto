export class Context {

    private pos: number;
    private code: string;
    private builtins: Map<string, Builtin>;
    private memory: Memory;
    private lastInstructions: Instructions;
    private currentSection: Section;
    private currentAddress: Address;
    private commentTag: string;

    constructor(code: string);

    registerBuiltin(builtin: Builtin): void;
    getCurrentAddress(): Address;
    setCurrentSection(sectionName: Section): void;
    setMemory(memoryAddress: Address, value: MemoryValue): void;
    resetMemory(): void;
    getMemory(): Memory;
    advance(): void;
    run(): void;
    getCurrentSection(): Section;
    setCommentTag(tag: CommentTag): void;
    getCommentTag(): CommentTag;
    loop(amount: number): void;
    validateLine(line: Instruction);
    getBuiltin(name: Keyword): Builtin;
}

export type CommentTag = string;

export type Keyword = string;

export type Address = number;

export type Section = string;

export type Instruction = string;
export type Instructions = Instruction[];

export type Memory = number[];
export type MemoryValue = number;

export type BuiltinCallbackArguments = string[];

export type Builtin = {
    name: Keyword,
    callback: (args: BuiltinCallbackArguments) => void;
}

