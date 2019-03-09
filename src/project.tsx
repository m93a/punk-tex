import Tab from "./tabs";
import Reference from "./structures/Reference";
import { SerializedEquation } from "./tabs/Equations";
import { Quantity } from "./tabs/Quantities";
import { Data } from "./tabs/DataManager";

import sampleReferences from "./defaults/sampleReferences";
import sampleEquations from "./defaults/sampleEquations";
import sampleQuantities from "./defaults/sampleQuantities";
import sampleTables from "./defaults/sampleTables";
import sampleText from "./defaults/sampleText";

type id = string;

class Project
{
    public tabs: (typeof Tab)[] = [];
    public content: string = '';

    public references: Map<id, Reference.Params>;
    public equations:  Map<id, SerializedEquation>;
    public quantities: Map<id, Quantity>;
    public tables:     Map<id, Data>;

    constructor(defaults?: boolean) {
        if (defaults) {
            this.content    = sampleText;
            this.references = sampleReferences();
            this.equations  = sampleEquations();
            this.quantities = sampleQuantities();
            this.tables     = sampleTables();
        } else {
            this.references = new Map<id, Reference.Params>();
            this.equations  = new Map<id, SerializedEquation>();
            this.quantities = new Map<id, Quantity>();
            this.tables     = new Map<id, Data>();
        }
    }
}

export default Project;