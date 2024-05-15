const { body,param } = require('express-validator');
const Models = require('../../../data_access/models');

const ShareFileValidationRulesRequest = () => {
    return [
        body('user_id').trim().exists().notEmpty().withMessage('Please provide a user ID').custom(async (value) => {
            const user = await Models.User.findById(value);
            if (!user) {
                throw new Error('User does not exist');
            }
            return true;
        }),
        body('file_id').trim().exists().notEmpty().withMessage('Please provide a file ID').custom(async (value) => {
            const file = await Models.File.findById(value);
            if (!file) {
                throw new Error('File does not exist');
            }
            return true;
        }),
        body('permission_level').isObject().withMessage('Permission level must be an object'),
        body('permission_level.view').exists().notEmpty().withMessage('Please provide view permission').isBoolean().withMessage('View permission must be a boolean'),
        body('permission_level.download').exists().notEmpty().withMessage('Please provide download permission').isBoolean().withMessage('Download permission must be a boolean'),
    ];
};

const ShareFileGroupValidationRulesRequest = () => {
    return [
        body('group_id').trim().exists().notEmpty().withMessage('Please provide a group ID').custom(async (value) => {
            const group = await Models.Group.findById(value);
            if (!group) {
                throw new Error('Group does not exist');
            }
            return true;
        }),
        body('file_ids').isArray().withMessage('File IDs must be an array').custom(async (value) => {
            const files = await Models.File.find({ _id: { $in: value } });
            if (files.length !== value.length) {
                throw new Error('One or more files do not exist');
            }
            return true;
        }),
    ];
};

const CreateGroupValidationRulesRequest = () => {
    return [
        body('user_ids').exists().withMessage('Please provide user IDs').isArray().withMessage('User IDs must be an array').custom(async (value) => {
            const users = await Models.User.find({ _id: { $in: value } });
            if (users.length !== value.length) {
                throw new Error('One or more users do not exist');
            }
            return true;
        }),
        body('name').trim().exists().notEmpty().withMessage('Please provide a group name'),
    ];
};

const ListGroupValidationRulesRequest = () => {
    return [
        body('group_id').trim().exists().notEmpty().withMessage('Please provide a group ID').custom(async (value) => {
            const group = await Models.Group.findById(value);
            if (!group) {
                throw new Error('Group does not exist');
            }
            return true;
        }),
    ];
};

const ChangeFilePermissionValidationRulesRequest = () => {
    return [
        body('file_id').trim().exists().notEmpty().withMessage('Please provide a file ID').custom(async (value) => {
            const file = await Models.File.findById(value);
            if (!file) {
                throw new Error('File does not exist');
            }
            return true;
        }),
        body('is_public').exists().notEmpty().withMessage('Please provide status').isBoolean().withMessage('Is public must be a boolean'),
    ];
};

const DeleteFilePermissionValidationRulesRequest = () => {
    return [
        param('file_id').trim().exists().notEmpty().withMessage('Please provide a file ID').custom(async (value) => {
            const file = await Models.File.findById(value);
            if (!file) {
                throw new Error('File does not exist');
            }
            return true;
        }),
    ];
};

const DownloadFilePermissionValidationRulesRequest = () => {
    return [
        param('file_id').trim().exists().notEmpty().withMessage('Please provide a file ID').custom(async (value) => {
            const file = await Models.File.findById(value);
            if (!file) {
                throw new Error('File does not exist');
            }
            return true;
        }),
    ];
};

module.exports = {
    ShareFileValidationRulesRequest,
    ShareFileGroupValidationRulesRequest,
    CreateGroupValidationRulesRequest,
    ListGroupValidationRulesRequest,
    ChangeFilePermissionValidationRulesRequest,
    DeleteFilePermissionValidationRulesRequest,
    DownloadFilePermissionValidationRulesRequest
}