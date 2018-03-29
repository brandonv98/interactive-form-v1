"use strict";
window.onload = () => { // On load select input form. === first;
	const input = nodes.form.querySelector('input'); // Get first input element within form.
	const firstDiv = nodes.fieldset[3].querySelector('DIV').style.display = 'none'; // Hide the payment div
	input.focus(); // Focus input.
	input.select(); // Then select Element.
};
const nodeConfig = (f) => { // Traverse the DOM to select needed nodes.
	const form = document.querySelector('FORM');
	const fieldsetFirst = form.firstElementChild;
	const fieldsets = form.querySelectorAll('FIELDSET');
	const jobRole = fieldsetFirst.lastElementChild;
	const exportNodes = {
		form,
		fieldsetFirst,
		jobRole,
		fieldset: fieldsets,
	};
	return exportNodes;
};
let nodes = nodeConfig(); // Save slected nodes.
let someState = [];
// const select = nodes.fieldset[3].querySelector('SELECT');
const disabledColorShirts = (selectNode) => { // Param = the select node from { nodes.fieldset[2].color section }.
	const newOptionNode = document.createElement('OPTION'); // Create new option node.
	selectNode.append(newOptionNode); // append new option node.
	newOptionNode.innerHTML = 'Select a theme first..'; // Add description.
	newOptionNode.setAttribute('selected', true); // Set option node to show first.
	selectNode.setAttribute('disabled', true); // Disable color box.
};
// ============================================================================
// ----------------		Event Listeners	& Start State 	-------------------------
// ============================================================================
const onLoad = (node) => {
	node.addEventListener("change", handleCcSelection, true);
	nodes.jobRole.addEventListener("change", jobRoleSelection, true);
	nodes.fieldset[1].querySelector('SELECT[id="design"]').addEventListener("change", handleShirtSelect, true);
	nodes.fieldset[2].addEventListener("change", handleCrossTimes, true);
	disabledColorShirts(nodes.fieldset[1].lastElementChild.lastElementChild);
}
// ===========================================
// ---------		Section 1	 	------------------
// ===========================================
const elementsToCreate = (appendLocation) => { // Create and append new input if other is selected.
	let newDiv = document.createElement('DIV');
	let HTML = `
  <label for="other-title">Other Job Role</label>
    <input type="text" id="other-title" name="user_job" placeholder="Your Job Role">`;
	appendLocation.appendChild(newDiv);
	newDiv.innerHTML = `${HTML}`;
};
const jobRoleSelection = (e) => {
	let otherValue = e.target.value === 'other';
	let appendedDiv = nodes.fieldsetFirst.lastElementChild;
	if (otherValue) {
		elementsToCreate(nodes.fieldsetFirst);
	} else if (appendedDiv.tagName === 'DIV') {
		appendedDiv.remove(); // Remove old Div
	}
};
// ===========================================
// ---------		Section 2	 	------------------
// ===========================================
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
const handleShirtSelect = (e) => {
	let shirt = e.target.value; // Users desired shirt.
	const selected = nodes.fieldset[1].lastElementChild.lastElementChild; // Select Node.
	const options = nodes.fieldset[1].lastElementChild.lastElementChild.querySelectorAll('OPTION'); // Option Nodes.
	if (selected.disabled) {
		options[options.length - 1].remove();
		selected.removeAttribute('disabled');
		options[0].setAttribute('selected', true);
	} else if (shirt === 'heart js') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else if (shirt === 'js puns') {
		handleColors(nodes.fieldset[1].lastElementChild.lastElementChild, shirt);
	} else {
		disabledColorShirts(selected);
	}
};
// ===========================================
// ---------		Section 3	 	------------------
// ===========================================
const findCrossTimes = (checkTimes, btnClicked) => {
	checkTimes = checkTimes.children;
	const storeState = [];

	let clickedBtnLabel = btnClicked.parentNode.textContent;
	let clickedBtnLabelFind = clickedBtnLabel.indexOf('— ');
	let clickedBtnLabelFindChar = clickedBtnLabel.charAt(clickedBtnLabelFind);
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
		let checked = timesArray[timesArray.length - 1].checked;
		if (checked) {
			timesArray[timesArray.length - 1].removeAttribute('disabled');
			timesArray[timesArray.length - 1].parentNode.setAttribute('style', 'opacity: 1;');
		}
	} catch (e) {
		console.error('This a problem...');
	}
};
const handleCrossTimes = (e) => {
	// console.log(e.target, e.target.value);
	let sameTimes = e.target;
	// console.log(e.target.parentNode.textContent.indexOf(sameTimes));
	const times = findCrossTimes(nodes.fieldset[2], sameTimes);
	// if (e.target.textContent.charAt('Tuesday')); {
	console.log(times);
	disableTimes(times);
};
// ===========================================
// ---------		Section 4	 	------------------
// ===========================================
const handleCcSelection = (e) => {
	const firstDiv = nodes.fieldset[3].querySelector('DIV');
	const select = nodes.fieldset[3].querySelector('SELECT');
	const isCC = select.value === 'credit card'; // CreditCard
	const isPP = select.value === 'paypal'; // PayPal
	const isBC = select.value === 'bitcoin'; // Bitcoin

	if (isCC) {
		firstDiv.style.display = 'block';
	} else if (isPP) {
		const url = 'https://www.paypal.com/us/home';
		window.open(url, '_blank');
	} else if (isBC) {
		const url = 'https://bitcoin.org/en/';
		window.open(url, '_blank');
	} else {
		firstDiv.style.display = 'none';
	}
};


onLoad(nodes.fieldset[3]);