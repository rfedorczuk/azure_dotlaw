const axios = require('axios');
const Course = require('../models/website/course'); // Upewnij się, że ścieżka jest poprawna
const Lesson = require('../models/website/lesson'); // Załóżmy, że ścieżka jest prawidłowa


class VimeoController {
    static async fetchCoursesFromVimeo() {
        const accessToken = '2438a355d87d1b7df09ac8bf75a48adf';
        try {
            const response = await axios.get('https://api.vimeo.com/users/210802805/folders', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const folders = response.data.data; // Zakładając, że odpowiedź zawiera tablicę w `data.data`

            // Filtrowanie kursów, które są prywatne
            const publicFolders = [];
            for (const folder of folders) {
                const courseId = folder.uri.split('/').pop(); // Extract courseId from folder.uri
                const isPrivate = await Course.isCoursePrivate(courseId);
                if (!isPrivate) {
                    publicFolders.push(folder);
                }
            }

            return { ...response.data, data: publicFolders }; // Zwraca oryginalną strukturę danych, ale z odfiltrowanymi folderami
        } catch (error) {
            console.error('Error fetching courses from Vimeo:', error.message);
            throw error;
        }
    }
    // static async fetchCoursesFromVimeo() {
    //     const accessToken = '2438a355d87d1b7df09ac8bf75a48adf';
    //     try {
    //         const response = await axios.get('https://api.vimeo.com/users/210802805/folders', {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });
    //         return response.data;
    //     } catch (error) {
    //         console.error('Error fetching courses from Vimeo:', error.message);
    //         throw error;
    //     }
    // }

    static async getCourses(req, res, next) {
        console.log('getcoureses')
        try {
            const data = await VimeoController.fetchCoursesFromVimeo();
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    
    static async getCourseDetails(req, res, next) {
        const accessToken = '2438a355d87d1b7df09ac8bf75a48adf';
        const courseId = req.params.courseId;
        
        try {
            // Najpierw pobierz cenę kursu z bazy danych
            const courseData = await Course.findByCourseId(courseId);
            if (!courseData) {
                return res.status(404).json({ message: 'Course not found' });
            }
            
            // Następnie pobierz dane z Vimeo
            const response = await axios.get(`https://api.vimeo.com/users/210802805/projects/${courseId}/videos`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
            // Połącz dane z Vimeo i cenę kursu z bazy danych
            const combinedResponse = {
                ...response.data,
                price: courseData.price,
                courseId: courseData.course_id // Dodaj cenę do odpowiedzi
            };
    
            res.json(combinedResponse);
        } catch (error) {
            next(error);
        }
    }


    // static async getCourseDetails(req, res, next) {
    //     const accessToken = '2438a355d87d1b7df09ac8bf75a48adf';
    //     const courseId = req.params.courseId;
    //     try {
    //         const response = await axios.get(`https://api.vimeo.com/users/210802805/projects/${courseId}/videos`, {
    //             headers: {
    //                 'Authorization': `Bearer ${accessToken}`
    //             }
    //         });
    //         res.json(response.data);
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    static async saveLessonsForCourse(vimeoCourseId) {
        console.log(`Starting saveLessonsForCourse for Vimeo Course ID: ${vimeoCourseId}`);
        const accessToken = '2438a355d87d1b7df09ac8bf75a48adf';
        try {
            const courseId = await Course.findById(vimeoCourseId);
            if (!courseId) {
                console.error(`Course with Vimeo ID ${vimeoCourseId} not found in database.`);
                return;
            }
    
            const response = await axios.get(`https://api.vimeo.com/users/210802805/projects/${vimeoCourseId}/videos`, {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
    
            const savePromises = response.data.data.map(lesson => {
                // Wyodrębnienie lessonId z URI
                const lessonUriParts = lesson.uri.split('/');
                const lessonId = lessonUriParts[lessonUriParts.length - 1]; // Pobranie ostatniego segmentu URI, który jest lessonId
                console.log('lessonid ',lessonId)
    
                return Lesson.create({
                    course_id: courseId,
                    lesson_id: lessonId, // Użycie wyodrębnionego lessonId
                    title: lesson.name,
                    duration: lesson.duration
                }).catch(error => console.error(`Error saving lesson ${lesson.name}:`, error));
            });
    
            await Promise.all(savePromises);
            await Course.updateTotalDuration(courseId); // Użyj właściwej metody do uzyskania ID kursu w bazie danych, jeśli potrzebne

        console.log(`All lessons for course ${vimeoCourseId} saved to database and total duration updated.`);
    } catch (error) {
        console.error(`Error in saveLessonsForCourse for course ${vimeoCourseId}:`, error);
    }
}
    
    
    
    
    
    
    static async saveCoursesToDatabase() {
        try {
            const vimeoCourses = await VimeoController.fetchCoursesFromVimeo();
            // Utwórz tablicę obietnic dla wszystkich operacji zapisywania kursów i lekcji
            const coursePromises = vimeoCourses.data.map(async (course) => {
                const courseId = course.uri.split('/').pop(); // Pobiera ostatni segment z URI, np. "19347952"
                await Course.create({
                    course_id: courseId, // Użyj wyodrębnionego courseId
                    title: course.name,
                    description: course.description,
                    // Dodaj pozostałe wymagane pola
                });
                // Po zapisaniu kursu, zapisz lekcje dla tego kursu
                return VimeoController.saveLessonsForCourse(courseId);
            });
    
            // Oczekiwanie na zakończenie wszystkich operacji zapisywania kursów i lekcji
            await Promise.all(coursePromises);
    
            console.log('Courses and lessons saved to database.');
        } catch (error) {
            console.error('Error saving courses and lessons to database:', error);
        }
    }
    
    
    // static async saveCoursesToDatabase() {
    //     try {
    //         const vimeoCourses = await VimeoController.fetchCoursesFromVimeo();
    //         await Promise.all(vimeoCourses.data.map(course => {
    //             // Wyodrębnij company_id (lub courseId) z uri
    //             const courseId = course.uri.split('/').pop(); // Pobiera ostatni segment z uri, np. "19347952"
    
    //             // Teraz użyj courseId w wywołaniu Course.create
    //             return Course.create({
    //                 course_id: courseId, // Użyj wyodrębnionego courseId
    //                 title: course.name,
    //                 description: course.description,
    //                 // Dodaj pozostałe wymagane pola
    //             });
    //         }));
    //         console.log('Courses saved to database.');
    // } catch (error) {
    //     console.error('Error saving courses to database:', error);
    // } finally {
    //     console.log('Courses saved to database.');
    // }
    // }
    
}

module.exports = VimeoController;
