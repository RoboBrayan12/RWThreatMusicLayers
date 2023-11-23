const soundtrackNames = {
	CC: ["Chimney Canopy", "Cobertura de Chaminés"],
	LF: ["Farm Arrays", "Conjuntos Agrários"],
	SS: ["Five Pebbles", "Cinco Seixos"],
	GW: ["Garbage Wastes", "Resíduos de Lixo"],
	HI: ["Industrial Complex", "Complexo Industrial"],
	DM: ["Looks to the Moon", "Olha Pra Lua"],
	LCd: ["Metropolis - Day", "Metrópole - Dia"],
	LCn: ["Metropolis - Night", "Metrópole - Noite"],
	OE: ["Outer Expanse", "Vastidão Exterior"],
	SU: ["Outskirts", "Periferia"],
	VS: ["Pipeyard", "Pátio de Canos"],
	HR: ["Rubicon", "Rubicon"],
	SL: ["Shoreline", "Litoral"],
	SI: ["Sky Islands", "Ilhas do Céu"],
	LM: ["Waterfront Facility", "Complexo a Beria-mar"],
}
const soundtracklayers = {
	CC: ["KICK", "SNARE", "PERC1", "BASS", "PERC2", "ARPS", "VOX", "NOISE", "GUTTERBASS", "GUTTERVOX"],
	LF: ["KICK", "SHAKER", "PERC1", "BASS", "SNARE", "PERC2", "ARPS", "NOISE"],
	SS: ["KICK", "BASS", "LEAD", "NOISE", "POP"],
	GW: ["KICK", "SHAKE", "PERC1", "BASS", "PERC2", "WEIRD", "VOX", "LEAD", "NOISE"],
	HI: ["KICK", "SHAKER", "PERC1", "SNARE", "BASS", "WEIRD", "VOX", "NOISE"],
	DM: ["KICK", "NOISE", "SHAKER", "BASS", "LEAD", "SNARE"],
	LCd: ["KICK", "ATMOS", "SUB", "SHAKER", "BREAKS", "PERC", "TOM", "ARP", "SYNTH"],
	LCn: ["KICK", "ATMOS", "SUB", "SHAKER", "NOISE", "HAT", "PERC", "TOM", "SYNTH"],
	OE: ["NOISE", "KICKPERC", "PERC2", "ARP", "LEAD", "FLOW", "BASS", "WAVES"],
	SU: ["KICK", "SHAKER", "PERC1", "BASS", "HITS", "ARPS", "LEAD", "NOISE"],
	VS: ["PERC2", "KICK", "SHAKER", "PERC1", "BASS", "NOISE", "ARPS", "SYNTH", "WEIRD"],
	HR: ["HAT1", "KICK", "BASS", "PERC", "HAT2", "SNARE", "LEAD", "WEIRD", "PAD", "NOISE"],
	SL: ["KICK", "BASS", "SNARE", "PERC1", "PERC2", "ARPS", "LEAD", "NOISE"],
	SI: ["KICK", "SHAKER", "WEIRD", "PERC1", "BASS", "ARPS", "SNARE", "NOISE"],
	LM: ["KICK", "PERC2", "SNARE", "PERC1", "BASS", "PAD", "ARPS", "WEIRD", "NOISE"],
}

const transitionEffect = document.getElementById("transitionEffect")
const menu = document.getElementById("soundtrackMenu")
const container = document.getElementById("groupSwitch")
const loopCheckbox = document.getElementById("loopCheckbox")
const soundtrackTitle = document.getElementById("soundtrackTitle")
const soundtrackName = document.getElementById("soundtrackName")
const background = document.getElementById("content")

const sound_UIArp = document.querySelector(`#sound_UIArp`)
const sound_UIMetal1 = document.querySelector(`#sound_UIMetal1`)
const sound_UIMetal3 = document.querySelector(`#sound_UIMetal3`)

for (let soundtrackItem in soundtrackNames) {
	const newButton = document.createElement("button")
	newButton.type = "button"
	newButton.className = "buttonLong"
	newButton.value = soundtrackItem
	newButton.onclick = function () {
		menu.style.display = "none"
		loadSoundTrack(this.value)
	}
	newButton.innerHTML = soundtrackNames[soundtrackItem][1]
	menu.appendChild(newButton)
}

function toggleMenu() {
	if (menu.style.display == "inline-flex") {
		menu.style.display = "none"
		sound_UIMetal3.play()
	} else {
		menu.style.display = "inline-flex"
		sound_UIMetal1.currentTime = 0
		sound_UIMetal1.play()
	}
}

let soundtrack = "SU"
applySoundtrack(soundtrack, true)

function loadSoundTrack(value) {
	transitionEffect.style.zIndex = 1
	transitionEffect.style.backgroundColor = "black"

	sound_UIArp.currentTime = 0
	sound_UIArp.play()
	setTimeout(function () {
		applySoundtrack(value)
		transitionEffect.style.backgroundColor = "transparent"
		transitionEffect.style.zIndex = -1
	}, 500)
}

function applySoundtrack(value) {
	soundtrack = value

	let children = container.children
	if (children) {
		for (let i = children.length - 1; i >= 0; i--) {
			children[i].remove()
		}
	}

	for (let layer of soundtracklayers[soundtrack]) {
		const newAudio = document.createElement("audio")
		newAudio.src = `music/${soundtrackNames[soundtrack][0]} (${soundtrack})/TH_${soundtrack} - ${layer}.wav`
		newAudio.id = "audio_" + layer
		newAudio.volume = 0
		container.appendChild(newAudio)

		const newInput = document.createElement("input")
		newInput.type = "checkbox"
		newInput.id = "switch_" + layer
		newInput.onchange = function () {
			toggle(this.id, this.checked)
		}
		container.appendChild(newInput)

		const newLabel = document.createElement("label")
		newLabel.htmlFor = "switch_" + layer
		newLabel.innerHTML = layer
		container.appendChild(newLabel)
	}

	loopCheckbox.checked = false

	soundtrackTitle.innerHTML = soundtrackNames[soundtrack][0]
	soundtrackName.innerHTML = `~ ${soundtrackNames[soundtrack][1]} ~`
	background.style.backgroundImage = `url('images/landscape/landscape - ${soundtrack.toLowerCase()} - flat.png')`
}

function playAll() {
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).play()
	}
}
function pauseAll() {
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).pause()
	}
}
function stopAll() {
	for (let layer of soundtracklayers[soundtrack]) {
		const audio = document.querySelector("#audio_" + layer)
		audio.pause()
		audio.currentTime = 0
	}
}
function resync() {
	let baseTime = document.querySelector("#audio_" + soundtracklayers[soundtrack][0]).currentTime
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).currentTime = baseTime
	}
}
function loopAll(checked) {
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).loop = checked
	}
}

const loopToggle = document.getElementById("loopToggle")
function toggleLoop() {
	if (loopToggle.value == "true") {
		loopToggle.value = "false"
	} else {
		loopToggle.value = "true"
	}
}

function toggle(id, checked) {
	let audio = document.getElementById("audio_" + id.slice(7))
	if (checked) {
		audio.volume = 1
	} else {
		audio.volume = 0
	}
}
