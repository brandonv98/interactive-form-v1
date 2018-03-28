// "use strict";
const form = document.querySelector('FORM');
const nodeConfig = (f) => { // Traverse the DOM to select needed nodes.
	const fieldsetFirst = f.firstElementChild;
	const jobRole = fieldsetFirst.lastElementChild;
	const exportNodes = { form, fieldsetFirst, jobRole };
	return exportNodes;
};
let nodes = nodeConfig(form); // Save slected nodes.

elementsToCreate = (appendLocation) => { // Create and append new input if other is selected.
	let newDiv = document.createElement('DIV');
	let HTML = `
  <label for="title-job">Other Job Role</label>
    <input type="text" id="title-job" name="user_job">`;
	appendLocation.appendChild(newDiv);
	newDiv.innerHTML = `${HTML}`;
};

jobRoleSelection = (e) => {
	let otherValue = e.target.value === 'other';
	let appendedDiv = nodes.fieldsetFirst.lastElementChild;
	if (otherValue) {
		elementsToCreate(nodes.fieldsetFirst);
	} else if (appendedDiv.tagName === 'DIV') {
		appendedDiv.remove(); // Remove old Div
	}
};




nodes.jobRole.addEventListener("change", jobRoleSelection, true);

window.onload = () => { // On load select input form. === first;
	const input = form.querySelector('input'); // Get first input element within form.
	input.focus(); // Focus input.
	input.select(); // Then select Element.
};