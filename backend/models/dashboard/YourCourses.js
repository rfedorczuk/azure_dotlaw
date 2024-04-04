class YourCourse {
    constructor(id, title, description, createdAt, courseId, updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.createdAt = createdAt;
        this.courseId = courseId;
        this.updatedAt = updatedAt;
    }

    // Metody do interakcji z bazą danych, np. findByVimeoId, create, itp.
}

module.exports = YourCourse;