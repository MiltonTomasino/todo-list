import "./style.css";
import { compareAsc, compareDesc } from "date-fns";

class Project {
    constructor(title, description, dueDate, priority, tasks = []) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.tasks = tasks;
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

    function sortProjects(method) {
        let sortedCopy = [...projectList];

        switch (method) {
            case "due-desc":
                sortedCopy.sort((a, b) => {
                    return compareAsc(new Date(a.dueDate), new Date(b.dueDate));
                });
                return sortedCopy;
            case "due-asc":
                sortedCopy.sort((a, b) => {
                    return compareDesc(new Date(a.dueDate), new Date(b.dueDate));
                });
                return sortedCopy;
            case "prio-desc":
                sortedCopy.sort((a, b) => {
                    return compareAsc(new Date(a.priority), new Date(b.priority));
                });
                return sortedCopy;
            case "prio-asc":
                sortedCopy.sort((a, b) => {
                    return compareDesc(new Date(a.priority), new Date(b.priority));
                });
                return sortedCopy;
            default:
                return sortedCopy
        }
    }

    return {
        setProjectList,
        getProjectList,
        doesProjectListExist,
        createProjectList,
        appendToList,
        sortProjects,
    }

})();

const ProjectManipulation = (() => {

    function createProject(title, description, dueDate, priority, tasks) {
        let project = new Project(title, description, dueDate, priority, tasks);
        localStorageManipulation.appendToList(project);
        return project;
    }

    function createNewCard(project) {

        if (project.tasks.length > 0) console.log("tasks has more than 1");
        

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

        let taskBox = document.createElement("div");
        taskBox.classList.add("task-box");

        if (project.tasks.length > 0) {
            for (let i = 0; i < project.tasks.length; i++) {
                console.log(project.tasks[i]);
                let taskContainer = document.createElement("div");

                taskContainer.classList.add("task-container");
                let task = document.createElement("label");
                let taskCheck = document.createElement("input");

                taskCheck.type = "checkbox";
                taskCheck.value = false;
                task.textContent = project.tasks[i];

                taskContainer.appendChild(task);
                taskContainer.appendChild(taskCheck);
                taskBox.appendChild(taskContainer);
            }
        }
        
        header1.textContent = `${project.title}`;
        para.textContent = `${project.description}`;
        due.textContent = `Due: ${project.dueDate}`;
        prio.textContent = `Priority: ${project.priority}`;

        card.appendChild(header1);
        card.appendChild(para);
        card.appendChild(due);
        card.appendChild(prio);
        card.appendChild(taskBox);

        return card;
    }

    function getAllTasks() {
        let tasks = document.querySelectorAll(".task");
        let taskList = [];

        if (tasks.length < 1) return taskList;

        for (let i = 0; i < tasks.length; i++) {
            taskList.push(tasks[i].value);
        }

        return taskList;
    }

    return {
        createNewCard,
        createProject,
        getAllTasks,
    }
})();


const DomManipulation = (() => {
    let modal = document.querySelector(".modal");
    let mainContent = document.querySelector(".main");
    let gridTask = document.querySelector(".grid-task");
    let sortBox = document.querySelector(".sort-box");

    function appendToMain(child) {
        mainContent.appendChild(child);
    }


    function showFormModal() {
        modal.showModal();
    }

    function closeFormModal() {
        modal.close();
    }

    function updateDOM(method = null) {
        let mainList = document.querySelectorAll(".card");
        mainList.forEach((item) => item.remove());

        let list = localStorageManipulation.getProjectList();
        if (list.length < 1) return;
        
        if (method) {
            list = localStorageManipulation.sortProjects(method);
        }

        for (let i = list.length - 1; i >= 0; i--) {
            appendToMain(ProjectManipulation.createNewCard(list[i]));
        }
    }

    function addTask() {
        let task = document.createElement("div");
        let taskLabel = document.createElement("label");
        let taskInput = document.createElement("input");

        task.classList.add("task-element");

        taskInput.type = "text";
        taskInput.classList.add("task");

        taskLabel.textContent = "Task: ";

        task.appendChild(taskLabel);
        task.appendChild(taskInput);

        gridTask.appendChild(task);
    }

    function clearModalInput(title, description, dueDate, priority) {
        title.value = ""
        description.value = "";
        dueDate.value = "";
        priority.value = "";
        
        let allTasks = document.querySelectorAll(".task-element")
        allTasks.forEach((item) => item.remove());
    }

    function toggleSortBtns(value) {
        if (value) {
            createSortBtns();
        } else {
            deleteSortBtns();
        }
    }

    function deleteSortBtns() {
        let sortBtns = document.querySelector(".sort-container");
        if(!sortBtns) return;
        sortBtns.classList.remove("active");
        sortBtns.classList.add("inactive");
    }

    function createSortBtns() {
        let sortContainer = document.querySelector(".sort-container")
        sortContainer.classList.remove("inactive");
        sortContainer.classList.add("active");
    }

    function getSortSelection() {
        let selections = document.getElementsByName("selection");
        
        for (let i = 0; i < selections.length; i++) {
            if (selections[i].checked) {
                return selections[i].value;
            }
        }

        return null;
    }

    return {
        showFormModal,
        closeFormModal,
        appendToMain,
        updateDOM,
        addTask,
        clearModalInput,
        toggleSortBtns,
        getSortSelection,
    }
})();

const ButtonManipulation = (() => {
    let newProject = document.querySelector("#new-project");
    let sortToggle = false;

    newProject.addEventListener("click", () => {
        DomManipulation.showFormModal();
    });

    let closeModal = document.querySelector("#close-modal");

    closeModal.addEventListener("click", () => DomManipulation.closeFormModal());

    let createCard = document.querySelector("#create-project");

    createCard.addEventListener("click", (e) => {
        e.preventDefault();

        let projectName = document.querySelector("#project-name");
        let projectDesc = document.querySelector("#project-description");
        let projectDueDate = document.querySelector("#due-date");
        let projectPriority = document.querySelector("#project-priority");

        let tasks = ProjectManipulation.getAllTasks();

        ProjectManipulation.createProject(
            projectName.value,
            projectDesc.value,
            projectDueDate.value, 
            projectPriority.value,
            tasks);

        DomManipulation.updateDOM();
        DomManipulation.closeFormModal();
        DomManipulation.clearModalInput(projectName, projectDesc, projectDueDate, projectPriority);
    })

    let taskBtn = document.querySelector("#create-task");
    taskBtn.addEventListener("click", (e) => {
        e.preventDefault();
        DomManipulation.addTask();
    });

    let sortList = document.querySelector(".sort");
    sortList.addEventListener("click", () => {
        sortToggle = !sortToggle;
        DomManipulation.toggleSortBtns(sortToggle);
    });

    let sortSelection = document.querySelector("#sort-list");
    sortSelection.addEventListener("click", (e) => {
        e.preventDefault();
        let result = DomManipulation.getSortSelection();
        if (!result) return;
        DomManipulation.updateDOM(result)
    })

})();

localStorageManipulation.doesProjectListExist();

DomManipulation.updateDOM();

console.log("Hello from index.js!");
