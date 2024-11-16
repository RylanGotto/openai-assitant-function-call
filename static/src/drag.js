const container = document.getElementById('todo-list-container');
let draggedItem = null;

// Prevent links from interfering with dragstart
document.querySelectorAll('.todo-list-item a').forEach(link => {
    link.addEventListener('dragstart', (e) => e.stopPropagation());
});

// Handle dragstart on .todo-list-item elements
container.addEventListener('dragstart', (e) => {
    const container = document.getElementById('todo-list-container');
    const item = e.target.closest('.todo-list-item'); // Find the closest .todo-list-item
    if (item) {
        draggedItem = item; // Set the dragged item
        item.classList.add('dragging');
        console.log('Drag started:', draggedItem);
    }
});

// Handle dragend: Clean up
container.addEventListener('dragend', (e) => {
    if (draggedItem) {
        console.log('Drag ended:', draggedItem);
        draggedItem.classList.remove('dragging');
        draggedItem = null;
    }
});

// Allow dragover on the container
container.addEventListener('dragover', (e) => {
    e.preventDefault(); // Allow the drop action

    // Declare 'afterElement' before using it
    const afterElement = getDragAfterElement(container, e.clientY);

    if (afterElement == null) {
        container.appendChild(draggedItem); // Append to the end
    } else {
        container.insertBefore(draggedItem, afterElement); // Insert before the identified element
    }
});

// Function to determine the element after which to place the dragged item
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.todo-list-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}