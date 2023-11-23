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

const menu = document.getElementById("soundtrackMenu")
const soundtrackTitle = document.getElementById("soundtrackTitle")
const soundtrackName = document.getElementById("soundtrackName")
const playToggle = document.getElementById("playToggle")
const pauseToggle = document.getElementById("pauseToggle")
const loopToggle = document.getElementById("loopToggle")
const container = document.getElementById("groupSwitch")
const background = document.getElementById("content")
const transitionEffect = document.getElementById("transitionEffect")
const sound_UI = []
sound_UI["Arp"] = document.querySelector(`#sound_UIArp`)
sound_UI["Metal1"] = document.querySelector(`#sound_UIMetal1`)
sound_UI["Metal3"] = document.querySelector(`#sound_UIMetal3`)

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
		playUISound("Metal3")
	} else {
		menu.style.display = "inline-flex"
		playUISound("Metal1")
	}
}

function loadSoundTrack(value) {
	transitionEffect.style.zIndex = 1
	transitionEffect.style.backgroundColor = "black"
	playUISound("Arp", true)
	setTimeout(function () {
		applySoundtrack(value)
		transitionEffect.style.backgroundColor = "transparent"
		transitionEffect.style.zIndex = -1
	}, 500)
}

let soundtrack = "SU"
applySoundtrack(soundtrack)

function applySoundtrack(value) {
	soundtrack = value

	let children = container.children
	if (children) {
		for (let i = children.length - 1; i >= 0; i--) {
			children[i].remove()
		}
	}

	switch (soundtracklayers[soundtrack].length) {
		case 5:
		case 6:
			container.style.width = "27rem"
			break
		case 9:
		case 10:
			container.style.width = "35rem"
			break
		default:
			container.style.width = "34rem"
	}

	playToggle.value = false
	pauseToggle.value = false
	loopToggle.value = false

	soundtrackTitle.innerHTML = soundtrackNames[soundtrack][0]
	soundtrackName.innerHTML = `~ ${soundtrackNames[soundtrack][1]} ~`
	background.style.backgroundImage = `url('backgrounds/landscape - ${soundtrack.toLowerCase()} - flat.png')`

	for (let layer of soundtracklayers[soundtrack]) {
		const newAudio = document.createElement("audio")
		newAudio.src = `music/${soundtrackNames[soundtrack][0]} (${soundtrack})/TH_${soundtrack} - ${layer}.wav`
		newAudio.id = "audio_" + layer
		newAudio.volume = 0
		container.appendChild(newAudio)

		const newButton = document.createElement("button")
		newButton.type = "button"
		newButton.id = "switch_" + layer
		newButton.className = "buttonToggle"
		newButton.value = false
		newButton.onclick = function () {
			toggleLayer(this)
		}
		newButton.innerHTML = layer
		container.appendChild(newButton)
	}

	const baseAudio = document.querySelector("#audio_" + soundtracklayers[soundtrack][0])
	baseAudio.addEventListener("ended", function () {
		if (!baseAudio.loop) {
			playToggle.value = false
		}
	})
}

function playUISound(value, ignore) {
	const baseAudio = document.querySelector("#audio_" + soundtracklayers[soundtrack][0])
	if (ignore || baseAudio.currentTime == 0 || baseAudio.paused || baseAudio.ended) {
		sound_UI[value].currentTime = 0
		sound_UI[value].play()
	}
}

function playAll() {
	playToggle.value = true
	pauseToggle.value = false
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).play()
	}
}
function pauseAll() {
	playToggle.value = false
	pauseToggle.value = true
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).pause()
	}
	playUISound("Metal1")
}
function stopAll() {
	playToggle.value = false
	pauseToggle.value = false
	for (let layer of soundtracklayers[soundtrack]) {
		document.getElementById("switch_" + layer).value = false
		const audio = document.querySelector("#audio_" + layer)
		audio.pause()
		audio.currentTime = 0
	}
	playUISound("Metal3")
}
function resync() {
	playUISound("Metal3")
	let baseTime = document.querySelector("#audio_" + soundtracklayers[soundtrack][0]).currentTime
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).currentTime = baseTime
	}
}

function toggleLoop(checked) {
	playUISound("Metal1")
	loopToggle.value = checked
	for (let layer of soundtracklayers[soundtrack]) {
		document.querySelector("#audio_" + layer).loop = checked
	}
}

function toggleLayer(element) {
	let checked = element.value != `true`
	element.value = checked
	let audio = document.getElementById("audio_" + element.id.slice(7))
	if (checked) {
		audio.volume = 1
	} else {
		audio.volume = 0
	}
}
