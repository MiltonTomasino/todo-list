import "./style.css";

class Project {
    constructor(title, description, dueDate, priority) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
    }
}

const localStorageManipulation = (() => {
    let projectList = [];

    function doesProjectListExist() {
        if (localStorage.getItem("projects")) {
            console.log("exists");
            return true;
        } else {
            console.log("doesn't exist");
            return false;
        }
    }

    function appendToList(project) {
        getProjectList();
        projectList.push(project);
        setProjectList();
    }

    function createProjectList() {
        localStorage.setItem("projects", JSON.stringify([]));
    }

    function setProjectList() {
        localStorage.setItem("projects", JSON.stringify(projectList));
    }

    function getProjectList() {
        try {
            
            let storedProject = localStorage.getItem("projects");
            if (storedProject) {
                projectList = JSON.parse(storedProject);
            }

        } catch (error) {
            console.error(`Error parsing list from local storage: ${error}`);
        }

        return projectList;
    }

    return {
        setProjectList,
        getProjectList,
        doesProjectListExist,
        createProjectList,
        appendToList,
    }

})();

const ProjectManipulation = (() => {

    function createProject(title, description, dueDate, priority) {
        let project = new Project(title, description, dueDate, priority);
        localStorageManipulation.appendToList(project);
        return project;
    }

    function createNewCard(project) {

        let card = document.createElement("div");
        card.classList.add("card");

        let header1 = document.createElement("h1");
        header1.classList.add("header1");
        let para = document.createElement("p");
        para.classList.add("desc");
        let due = document.createElement("p");
        due.classList.add("due-date")
        let prio = document.createElement("p"); 
        prio.classList.add("priority")
        
        header1.textContent = `${project.title}`;
        para.textContent = `${project.description}`;
        due.textContent = `Due: ${project.dueDate}`;
        prio.textContent = `Priority: ${project.priority}`;

        card.appendChild(header1);
        card.appendChild(para);
        card.appendChild(due);
        card.appendChild(prio);

        return card;
    }

    return {
        createNewCard,
        createProject,
    }
})();


const DomManipulation = (() => {
    let modal = document.querySelector(".modal");
    let mainContent = document.querySelector(".main");

    function appendToMain(child) {
        mainContent.appendChild(child);
    }


    function showFormModal() {
        modal.showModal();
    }

    function closeFormModal() {
        modal.close();
    }

    function updateDOM() {
        let mainList = document.querySelectorAll(".card");
        mainList.forEach((item) => item.remove());

        let list = localStorageManipulation.getProjectList();
        if (list.length < 1) return;

        for (let i = 0; i < list.length; i++) {
            appendToMain(ProjectManipulation.createNewCard(list[i]));
        }
    }

    return {
        showFormModal,
        closeFormModal,
        appendToMain,
        updateDOM,
    }
})();

const ButtonManipulation = (() => {
    let newProject = document.querySelector("#new-project");

    newProject.addEventListener("click", () => {
        DomManipulation.showFormModal();
    });

    let closeModal = document.querySelector("#close-modal");

    closeModal.addEventListener("click", () => DomManipulation.closeFormModal());

    let createCard = document.querySelector("#create-project");

    createCard.addEventListener("click", (e) => {
        e.preventDefault();
        // let newCard = ProjectManipulation.createNewCard();

        let projectName = document.querySelector("#project-name");
        let projectDesc = document.querySelector("#project-description");
        let projectDueDate = document.querySelector("#due-date");
        let projectPriority = document.querySelector("#project-priority");

        let project = ProjectManipulation.createProject(
            projectName.value,
            projectDesc.value,
            projectDueDate.value, 
            projectPriority.value);

        DomManipulation.updateDOM();
        DomManipulation.closeFormModal();
    })

})();

localStorageManipulation.doesProjectListExist();

DomManipulation.updateDOM();

console.log("Hello from index.js!");
