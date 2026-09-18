import { Observable } from "rxjs";
import { YesNoCancelResult } from "../../service/message-box.service";

export interface MessageBox {

    showInformation(message: string): void;

    showQuestionOkCancel(message: string): Observable<boolean>;

    showQuestionYesNoCancel(message: string): Observable<YesNoCancelResult>;
}