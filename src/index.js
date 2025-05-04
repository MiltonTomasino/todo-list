import "./style.css";

class Project {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

const ProjectManipulation = (() => {
    function createNewProject() {

    }

    return {
        createNewProject,
    }
})();


const DomManipulation = (() => {
    let modal = document.querySelector(".modal");


    function showFormModal() {
        modal.showModal();
    }

    function closeFormModal() {
        modal.close();
    }

    return {
        showFormModal,
        closeFormModal,
    }
})();

const ButtonManipulation = (() => {
    let newProject = document.querySelector("#new-project");

    newProject.addEventListener("click", () => {
        DomManipulation.showFormModal();
        ProjectManipulation.createNewProject();
    });

    let closeModal = document.querySelector("#close-modal");

    closeModal.addEventListener("click", () => DomManipulation.closeFormModal());

})();


console.log("Hello from index.js!");
