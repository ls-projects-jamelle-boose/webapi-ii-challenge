const db = require("./db");

const express = require("express");
const router = express.Router();

/**
|--------------------------------------------------
|  GET    | /api/posts     | Returns an array of all the post objects contained in the database.
|--------------------------------------------------
*/

router.get("/", (request, response) => {
  db.find()
    .then(posts => {
      response.status(200).json(posts);
    })
    .catch(err => {
      response.status(500).json({
        error: "The posts information could not be retrieved."
      });
    });
});

/**
|--------------------------------------------------
|  POST   | /api/posts     | Creates a post using the information sent inside the `request body`.
|--------------------------------------------------
**/

router.post("/", (request, response) => {
  const { body } = request;
  const { title, contents } = body;

  if (!title || !contents) {
    response.status(400).json({
      errorMessage: "Please provide title and contents for the post."
    });
  } else {
    db.insert(body)
      .then(post => {
        response.status(201).json({
          title,
          contents
        });
      })
      .catch(err => {
        response.status(500).json({
          error: "There was an error while saving the post to the database.",
          err
        });
      });
  }
});

/**
|--------------------------------------------------
| // POST /api/posts/:id/comments
|--------------------------------------------------
*/

router.post("/:id/comments", async (request, response) => {
  const { id } = request.params;
  const { body } = request;
  const commentInfo = { ...body, post_id: id };

  try {
    const posts = await db.findById(id);

    if (posts[0] === undefined) {
      response.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    } else {
      db.insertComment(commentInfo).then(post => {
        if (commentInfo.text === "") {
          response.status(400).json({
            errorMessage: "Please provide text for the comment."
          });
        } else {
          response.status(201).json(post);
        }
      });
    }
  } catch {
    response.status(500).json({
      error: "There was an error while saving the comment to the database."
    });
  }
});

/**
|--------------------------------------------------
|  GET    | /api/posts/:id | Returns the post object with the specified `id`.
|--------------------------------------------------
*/

router.get("/:id", (request, response) => {
  const { id } = request.params;

  db.findById(id)
    .then(post => {
      if (post[0] === undefined) {
        response.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        response.status(200).json(post);
      }
    })
    .catch(err => {
      response.status(500).json({
        error: "The post information could not be retrieved."
      });
    });
});

/**
|--------------------------------------------------
| // GET /api/posts/:id/comments
|--------------------------------------------------
*/

router.get("/:id/comments", async (request, response) => {
  const { id } = request.params;

  try {
    const comments = await db.findPostComments(id);

    if (comments.length) {
      console.log(comments);
      response.json(comments);
    } else {
      response.status(404).json({
        message: "The post with the specified ID does not exist."
      });
    }
  } catch (err) {
    response.status(500).json({
      error: "The comments information could not be retrieved."
    });
  }
});

/**
|--------------------------------------------------
|  DELETE | /api/posts/:id | Removes the post with the specified `id` and returns the deleted post.
|--------------------------------------------------
*/

router.delete("/:id", (request, response) => {
  const { id } = request.params;

  db.remove(id)
    .then(post => {
      if (!post) {
        response.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else {
        response.status(204).end();
      }
    })
    .catch(err => {
      response.status(500).json({
        success: "The post could not be removed"
      });
    });
});

/**
|--------------------------------------------------
| PUT    | /api/posts/:id | Updates the post with the specified `id` using data from the `request body`. Returns the modified document, **NOT the original**.
|--------------------------------------------------
*/

router.put("/:id", (request, response) => {
  const { body } = request;
  const { title, contents } = body;
  const { id } = request.params;
  // const userInfo = request.body;

  db.update(id, body)
    .then(updated => {
      if (!updated) {
        response.status(404).json({
          message: "The post with the specified ID does not exist."
        });
      } else if (updated && title && contents) {
        response.status(200).json({
          success: true,
          updated
        });
      } else {
        response.status(400).json({
          errorMessage: "Please provide title and contents for the post."
        });
      }
    })
    .catch(err => {
      response.status(500).json({
        success: false,
        err
      });
    });
});

module.exports = router;
