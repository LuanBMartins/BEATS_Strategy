const express = require("express");
const router = express.Router();
const request_controller = require("../controllers/request_controllers");

const middlewares = require('../middlewares');

const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb){
        const dir = process.env.PATH_REQUEST + `${req.request_inserted.protocol_number}`;

        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        const sub_dir = process.env.PATH_REQUEST + `${req.request_inserted.protocol_number}/imgs`;

        if(!fs.existsSync(sub_dir)){
            fs.mkdirSync(sub_dir);
        }

        cb(null, sub_dir);
    },
    filename: function (req, file, cb){
        cb(null, `${Date.now()}` + '_' + file.originalname);
    }
});

const multi_upload = multer({storage}).array('images', 10);




router.get('/requests/', middlewares.authorizeUser([0, 1]), request_controller.followRequestsStatus);

router.get('/requests/:id', middlewares.authorizeUser([2]), request_controller.readRequestById);

router.get('/requests/waiting/approval', middlewares.authorizeUser([2]), request_controller.followRequestsWaitingApproval);

router.post('/requests/addition', middlewares.authorizeUser([0, 1]),
            multi_upload,
            middlewares.assertBodyFields(['name', 'type', 'aliases', 'c', 'i', 'a', 'authn', 'authz', 'acc', 'nr']),
            request_controller.postAddRequestSaveJSON);

router.delete('/requests/delete/:protocol', middlewares.authorizeUser([0, 1]), request_controller.deleteRequest)

module.exports = router;