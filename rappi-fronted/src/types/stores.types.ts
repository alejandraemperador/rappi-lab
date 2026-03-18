export interface Store {
    id: string;
    name: string;
    isopen: boolean;
    userid: string
}

export interface CreateStoreDTO {
    name: string;
    userId: string;
}

export interface UpdateStoreStatusDTO {
    id: string;
    isopen: boolean;
}