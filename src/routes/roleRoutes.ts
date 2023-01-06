import {Router} from "express";

import * as RoleController from "../controllers/roleController";
import {roleValidator} from "../models/RoleModel";


const router = Router();

/* GET roles. */
router.get('/', RoleController.getRoles);

/* POST a role */
router.post('/', roleValidator(), RoleController.createRole);

/* PUT a role */
router.put('/:name', roleValidator(), RoleController.updateRole);

/* DELETE a role */
router.delete('/:name', RoleController.deleteRole);

/* GET a role */
router.get('/:name', RoleController.getRole);

/* GET a role with permissions */
router.get('/with-permissions/:name', RoleController.getRoleWithPermissions);

export default router;
