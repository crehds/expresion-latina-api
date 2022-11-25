const express = require('express');
const router = express.Router();
const PostersService = require('../../services/posters');
const multer = require('multer');
const postersService = new PostersService();

router.get('/', async function(req, res, next) {
  try {
    const posters = await postersService.getPosters();
    res.status(200).json({
      data: posters,
      message: 'posters listed'
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:posterId', async function(req, res, next) {
  const {posterId} = req.params;
  try {
    const poster = await postersService.getPoster({posterId});
    // * to see the image in Postman
    // res.status(200).type(poster.contentType).send(poster.img.buffer)
    res.status(200).json({
      data: poster,
      message: 'poster retrieved'
    });
  } catch (error) {
    next(error);
  }
});

const storage = multer.memoryStorage();
router.post(
    '/',
    multer({storage}).array('image'),
    async function(req, res, next) {
      try {
        if (req.files.length === 0) {
          res.status(200).json({
            data: 0,
            message: 'no se cargaron imágenes'
          });
        } else {
          const {files: posters} = req;
          const createdPoster = await postersService.createPosters(posters);

          res.status(201).json({
            data: createdPoster,
            message: 'poster created'
          });
        }
      } catch (error) {
        next(error);
      }
    }
);

router.put(
    '/?',
    multer({dest: '../uploads/'}).array('image'),
    async function(req, res, next) {
      const {postersId} = req.query;
      const {files: posters} = req;
      try {
        const updatedPoster = await postersService.updatePoster({
          postersId,
          posters
        });
        res.status(200).json({
          data: updatedPoster,
          message: 'poster updated'
        });
      } catch (error) {
        next(error);
      }
    }
);

// router.delete('/?', async function(req, res, next) {
//   const {postersId} = req.query;
//   try {
//     const deletedPoster = await postersService.deletePoster({
//       postersId
//     });
//     res.status(200).json({
//       data: deletedPoster,
//       message: 'poster deleted'
//     });
//   } catch (error) {
//     next(error);
//   }
// });

// router.delete('/deleteall', async function(req, res, next) {
//   try {
//     const deletedPosters = await postersService.deletePosters();
//     res.status(200).json({
//       data: deletedPosters,
//       message: 'All the posters are deleted'
//     });
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
