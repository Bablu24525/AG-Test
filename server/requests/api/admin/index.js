const { body } = require('express-validator');
const Models = require('../../../data_access/models');

const ChangeUserPermissionValidationRulesRequest = () => {
    return [
        body('user_id').trim().exists().notEmpty().withMessage('Please provide a user ID').custom(async (value) => {
            const user = await Models.User.findById(value);
            if (!user) {
                throw new Error('User does not exist');
            }
            return true;
        }),
        body('permissions').isObject().withMessage('Permissions must be an object').custom((value) => {
            const validPermissions = ['view', 'upload', 'delete', 'download'];
            for (const permission of Object.keys(value)) {
                if (!validPermissions.includes(permission)) {
                    throw new Error(`Invalid permission: ${permission}`);
                }
                if (typeof value[permission] !== 'boolean') {
                    throw new Error(`Permission ${permission} must be a boolean`);
                }
            }
            return true;
        }),
    ];
};

module.exports = {
    ChangeUserPermissionValidationRulesRequest
}