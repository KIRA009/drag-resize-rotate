const get_details = () => {
	return  {
		height: parseInt(div.style.height.slice(0, -2), 10),
		width: parseInt(div.style.width.slice(0, -2)),
		left: parseInt(div.style.left.slice(0, -2)),
		top: parseInt(div.style.top.slice(0, -2)),
		angle: parseInt(div.style.transform.slice(0, -3).slice(8), 10)
	}
}
const set_details = div_details => {
	div.style.height = `${div_details.height}px`
	div.style.width = `${div_details.width}px`
	div.style.left = `${div_details.left}px`
	div.style.top = `${div_details.top}px`
	div.style.transform = `rotateZ(${div_details.angle}deg)`
}
const stop_action = action => {
	if (actions[action]) {
		actions[action] = false
		actions.dragging = true
	}
}
const start_action = (evt, action) => {
	if (!actions[action]) {
		actions[action] = true;
		actions.dragging = false;
	}
	x = evt.clientX;
	y = evt.clientY;
}

let div_details;
let x = null;
let y = null;
let div = document.getElementsByTagName('div')[0];
let resizer = document.getElementById('resize');
let rotator = document.getElementById('rotate');
let actions = {
	dragging: true,
	resizing: false,
	rotating: false
}

// for dragging
const start_dragging = evt => {
	if (!actions.dragging) return
	if (div.getAttribute('moving') === '1') {
		div.setAttribute('moving', '0')
		return
	}
	div.setAttribute('moving', '1')
	x = evt.clientX;
	y = evt.clientY;
}
const stop_dragging = () => {
	if (!actions.dragging) return
	div.setAttribute('moving', '0');
}
const drag = evt => {
	if (!actions.dragging) return
	if (div.getAttribute('moving') === '1') {
		let div_details = get_details();
		let diffx = evt.clientX - x;
		let diffy = evt.clientY - y;
		div_details.left += diffx;
		div_details.top += diffy;
		set_details(div_details);
		x = evt.clientX;
		y = evt.clientY;
	}	
}

div.onmousedown = evt => start_dragging(evt)
div.onmouseup = evt => stop_dragging()
div.onmouseout = evt => stop_dragging()
div.onmousemove = evt => drag(evt)


// for resizing
div_details = get_details();
resizer.style.left = `${div_details.width}px`;
const resize = evt => {
	if (actions.resizing) {
		let div_details = get_details();
		let diffx = evt.clientX - x;
		let diffy = evt.clientY - y;
		div_details.width += diffx;
		div_details.height += diffy;
		set_details(div_details);
		resizer.style.left = `${div_details.width}px`
		rotator.style.left = `${div_details.width}px`
		x = evt.clientX;
		y = evt.clientY;
	}
}

resizer.onmousedown = evt => start_action(evt, 'resizing')
resizer.onmouseup = evt => stop_action('resizing')
resizer.onmouseout = evt => stop_action('resizing')
resizer.onmousemove = evt => resize(evt)

// for rotating
div_details = get_details();
rotator.style.left = `${div_details.width}px`;

rotator.onmousedown = evt => start_action(evt, 'rotating')
rotator.onmouseup = evt => stop_action('rotating')
rotator.onmouseout = evt => stop_action('rotating')
rotator.onmousemove = evt => {
	if (actions.rotating) {
		div_details = get_details();
		cx = div_details.left + (div_details.width / 2);
		cy = div_details.top + (div_details.height / 2);
		let init_angle = Math.atan2(div_details.height, div_details.width);
		let angle = Math.atan2(evt.clientY - cy, (evt.clientX - cx));
		div_details.angle = 180 * (angle + init_angle) / Math.PI;
		rotator.style.left = `${div_details.width}px`
		set_details(div_details);
	}
}