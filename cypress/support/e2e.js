import "./commands";
import "cypress-axe";
import "cypress-plugin-tab";
import {updateReadme} from "./functions";

after(() => {
    updateReadme();
});