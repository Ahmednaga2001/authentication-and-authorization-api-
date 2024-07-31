const multer = require('multer');
exports.uploadSingleImg = (fieldName) => {
    // 1) Disk Storage
    // const storage = multer.diskStorage({
    //     destination: function (req, file, cb) {
    //         cb(null, 'uploads/users')
    //     },
    //     filename: function (req, file, cb) {
    //         // user-${id}-Date.now()-extension
    //         const ext = file.mimetype.split("/")[1]
    //         const fileName = `user-${uuidv4()}-${Date.now()}.${ext}`
    //         cb(null, fileName)
    //     }
    // })

    // 2) memory storage
    const multerStorage = multer.memoryStorage()
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true)
        }
        else {
            cb(new ApiError("Only Images allowed", 400), false)
        }
    }
    const upload = multer({ storage: multerStorage, fileFilter })
    return upload.single(fieldName)
}

exports.uploadMixOfImages = (arrayOfFields)=>{
    const multerStorage = multer.memoryStorage()
    function fileFilter(req, file, cb) {
        if (file.mimetype.startsWith("image")) {
            cb(null, true)
        }
        else {
            cb(new ApiError("Only Images allowed", 400), false)
        }
    }
    const upload = multer({ storage: multerStorage, fileFilter })
    return upload.single(arrayOfFields)
}