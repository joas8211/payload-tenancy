"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshPermissionsField = void 0;
var React = require("react");
var forms_1 = require("payload/components/forms");
var utilities_1 = require("payload/components/utilities");
var RefreshPermissionsField = function () {
    var submitted = (0, forms_1.useFormSubmitted)();
    var processing = (0, forms_1.useFormProcessing)();
    var refreshPermissions = (0, utilities_1.useAuth)().refreshPermissions;
    React.useEffect(function () {
        if (submitted && !processing) {
            refreshPermissions();
        }
    }, [submitted, processing]);
    return null;
};
exports.RefreshPermissionsField = RefreshPermissionsField;
