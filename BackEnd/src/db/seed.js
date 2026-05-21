const db = require('./db');

db.serialize(() => {
    db.run(`
        INSERT INTO users(name, email)
        VALUES
        ('Admin', 'admin@gmail.com'),
        ('Nikita', 'nikita@gmail.com')
    `);

    db.run(`
        INSERT INTO posts(title, body, category, authorId)
        VALUES
        ('Post 1', 'Body 1', 'Навчання', 1),
        ('Post 2', 'Body 2', 'Робота', 2)
    `);

    db.run(`
        INSERT INTO comments(text, postId)
        VALUES
        ('Good post', 1),
        ('Nice', 1)
    `);

    console.log('Seed completed');
});