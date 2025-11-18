export interface AccountRequest {
accountNumber: string;
initialBalance: number;
}

export interface AccountResponse {
id: string;
accountNumber: string;
customerId: string;
customerName: string;
balance: number;
active: boolean;
createdAt: Date;
updatedAt: Date;
}