import "./commands";
import "cypress-axe";
import "cypress-plugin-tab";
import {updateReadme} from "./reporter";

after(() => {
    updateReadme();
});