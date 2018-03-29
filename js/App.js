// "use strict";
const nodeConfig = (f) => { // Traverse the DOM to select needed nodes.
	const form = document.querySelector('FORM');
	const fieldsetFirst = form.firstElementChild;
	const fieldsets = form.querySelectorAll('FIELDSET');
	const jobRole = fieldsetFirst.lastElementChild;
	const exportNodes = { form, fieldsetFirst, jobRole, fieldset: fieldsets };
	return exportNodes;
};
let nodes = nodeConfig(); // Save slected nodes.
let someState = [];
elementsToCreate = (appendLocation) => { // Create and append new input if other is selected.
	let newDiv = document.createElement('DIV');
	let HTML = `
  <label for="other-title">Other Job Role</label>
    <input type="text" id="other-title" name="user_job" placeholder="Your Job Role">`;
	appendLocation.appendChild(newDiv);
	newDiv.innerHTML = `${HTML}`;
};

// If the user selects "Theme - JS Puns"
// then the color menu should only display "Cornflower Blue," "Dark Slate Grey," and "Gold."
// If the user selects "Theme - I ♥ JS"
// then the color menu should only display "Tomato," "Steel Blue," and "Dim Grey."

jobRoleSelection = (e) => {
	let otherValue = e.target.value === 'other';
	let appendedDiv = nodes.fieldsetFirst.lastElementChild;
	if (otherValue) {
		elementsToCreate(nodes.fieldsetFirst);
	} else if (appendedDiv.tagName === 'DIV') {
		appendedDiv.remove(); // Remove old Div
	}
};

const handleColors = (colors, brand) => {
	for (let i = 0; i < colors.length; i++) {
		if (brand === 'js puns') {
			if (colors[i].textContent.indexOf('I') > 1) {
				colors[i].hidden = true;
			} else {
				colors[i].hidden = false;
			}
		} else if (brand === 'heart js') {
			if (colors[i].textContent.indexOf('Puns') > 1) {
				colors[i].hidden = true;
			} else {
				colors[i].hidden = false;
			}
		}
	}
};

handleShirtSelect = (e) => {
	let shirt = e.target.value;
	if (shirt === 'heart js') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else if (shirt === 'js puns') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	}
};
const findCrossTimes = (checkTimes, btnClicked) => {
	checkTimes = checkTimes.children;
	const storeState = [];

	let clickedBtnLabel = btnClicked.parentNode.textContent;

	let clickedBtnLabelFind = clickedBtnLabel.indexOf('— ');
	let clickedBtnLabelFindChar = clickedBtnLabel.charAt(clickedBtnLabelFind);
	// console.log(clickedBtnLabel.slice(clickedBtnLabelFind, -11));


	const mustFindMe = clickedBtnLabel.slice(clickedBtnLabelFind, -11);

	for (let i = 0; i < checkTimes.length; i++) {
		const strVal = checkTimes[i].textContent;

		let startPoint = strVal.indexOf('— ');
		let getChar = strVal.charAt(startPoint);
		let finalyFind = strVal.slice(startPoint, -11);
		if (finalyFind.includes(mustFindMe)) {
			console.log(finalyFind.includes(mustFindMe));
			storeState.push(checkTimes[i].firstElementChild);
		}
	}
	storeState.push(btnClicked);
	return storeState;
};

const disableTimes = (timesArray) => {
	let isValue = timesArray.length > 0;
	console.log(timesArray, 'first');
	let checked = timesArray[timesArray.length - 1].checked;


	if (!checked) {
		console.log(someState, 'not last');
		for (let i = 0; i < someState.length; i++) {
			someState[i].removeAttribute('disabled');
			someState[i].parentNode.setAttribute('style', 'opacity: 1;');
		}
	} else if (timesArray[timesArray.length - 1].checked) {
		for (let i = 0; i < timesArray.length; i++) {
			timesArray[i].setAttribute('disabled', true);
			timesArray[i].parentNode.setAttribute('style', 'opacity: 0.4;');
			someState.push(timesArray[i]);
		}
	}
	try {
		let checked = timesArray[timesArray.length - 1].checked || null;
		if (checked) {
			timesArray[timesArray.length - 1].removeAttribute('disabled');
			timesArray[timesArray.length - 1].parentNode.setAttribute('style', 'opacity: 1;');
		}
	} catch (e) {
		console.error('This is not a error.');
	}
};


handleCrossTimes = (e) => {
	// console.log(e.target, e.target.value);
	let sameTimes = e.target;
	// console.log(e.target.parentNode.textContent.indexOf(sameTimes));
	const times = findCrossTimes(nodes.fieldset[2], sameTimes);
	// if (e.target.textContent.charAt('Tuesday')); {
	console.log(times);
	disableTimes(times);

	// }
};




nodes.jobRole.addEventListener("change", jobRoleSelection, true);
// const design = nodes.fieldset[1].querySelector('SELECT[id="design"]');
nodes.fieldset[1].querySelector('SELECT[id="design"]').addEventListener("change", handleShirtSelect, true);
nodes.fieldset[2].addEventListener("change", handleCrossTimes, true);

window.onload = () => { // On load select input form. === first;
	const input = nodes.form.querySelector('input'); // Get first input element within form.
	input.focus(); // Focus input.
	input.select(); // Then select Element.
};