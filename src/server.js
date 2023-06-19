const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const secretKey = '39962b70cff1edf501de1675ae57bf14969ef4d4eaeb17599fa62c80dbdd2086';

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(`mongodb+srv://thefakeoggy:Killer341@cluster0.slifonp.mongodb.net/noteDB`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Enable CORS
app.use(cors());

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a user schema
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  password: String,
});

// Define a note schema
const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  text: String,
  time: String,
  color: String,
});

// Define a user model
const User = mongoose.model('User', userSchema);

// Define a note model
const Note = mongoose.model('Note', noteSchema);

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('Access token not found');
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).send('Invalid token');
    }

    req.user = user;
    next();
  });
}

// API endpoint to save a new note for a specific user
app.post('/api/notes', authenticateToken, (req, res) => {
  const { text, time, color } = req.body;
  const username = req.user.username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }

      const newNote = new Note({
        user: user._id,
        text,
        time,
        color,
      });

      return newNote.save();
    })
    .then((savedNote) => {
      res.json(savedNote);
    })
    .catch((error) => {
      console.error('Error saving note:', error);
      res.status(500).send('Error saving note');
    });
});

// API endpoint to fetch all notes for a specific user
app.get('/api/notes', authenticateToken, (req, res) => {
  const username = req.user.username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }

      return Note.find({ user: user._id }).exec();
    })
    .then((notes) => {
      res.json(notes);
    })
    .catch((error) => {
      console.error('Error fetching notes:', error);
      res.status(500).send('Error fetching notes');
    });
});

// API endpoint to update a note
app.put('/api/notes/:id', authenticateToken, (req, res) => {
  const noteId = req.params.id;
  const { text, time, color } = req.body;
  const username = req.user.username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }

      return Note.findOneAndUpdate(
        { _id: noteId, user: user._id },
        { $set: { text, time, color } },
        { new: true }
      ).exec();
    })
    .then((updatedNote) => {
      if (!updatedNote) {
        throw new Error('Note not found');
      }

      res.json(updatedNote);
    })
    .catch((error) => {
      console.error('Error updating note:', error);
      res.status(500).send('Error updating note');
    });
});

// API endpoint to delete a note
app.delete('/api/notes/:id', authenticateToken, (req, res) => {
  const noteId = req.params.id;
  const username = req.user.username;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        throw new Error('User not found');
      }

      return Note.findOneAndRemove({ _id: noteId, user: user._id }).exec();
    })
    .then((deletedNote) => {
      if (!deletedNote) {
        throw new Error('Note not found');
      }

      res.sendStatus(204);
    })
    .catch((error) => {
      console.error('Error deleting note:', error);
      res.status(500).send('Error deleting note');
    });
});

// API endpoint for user signup
app.post('/api/signup', (req, res) => {
  const { username, email, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        throw new Error('Username already exists');
      }

      const newUser = new User({
        username,
        email,
        password,
      });

      return newUser.save();
    })
    .then((savedUser) => {
      res.json(savedUser);
    })
    .catch((error) => {
      console.error('Error creating user:', error);
      res.status(500).send('Error creating user');
    });
});

// API endpoint for user login verification
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  User.findOne({ username, password })
    .then((user) => {
      if (!user) {
        throw new Error('Invalid username or password');
      }

      // Generate a token with the secret key
      const token = jwt.sign({ username: user.username }, secretKey);

      res.json({ user, token });
    })
    .catch((error) => {
      console.error('Error validating login:', error);
      res.status(401).send('Invalid username or password');
    });
});

// Route handler for the root URL
app.get('/', (req, res) => {
  res.send('Hello, this is the root page!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
