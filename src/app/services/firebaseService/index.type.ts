import { WhereFilterOp } from "@angular/fire/firestore";

export type TQueryExpression = {
    fieldName: string;
    condition: WhereFilterOp;
    value: string;
}