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
const soundtrackLayers = {
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

const soundtrackMenu = document.getElementById("soundtrackMenu")
const soundtrackTitle = document.getElementById("soundtrackTitle")
const soundtrackName = document.getElementById("soundtrackName")
const playToggle = document.getElementById("playToggle")
const pauseToggle = document.getElementById("pauseToggle")
const loopToggle = document.getElementById("loopToggle")
const randomizerToggle = document.getElementById("randomizerToggle")
const layerSection = document.getElementById("layerSection")
const background = document.getElementById("content")
const transitionEffect = document.getElementById("transitionEffect")

const sound_UI = []
sound_UI["Arp"] = document.querySelector(`#sound_UIArp`)
sound_UI["Metal1"] = document.querySelector(`#sound_UIMetal1`)
sound_UI["Metal3"] = document.querySelector(`#sound_UIMetal3`)

var soundtrack = "SU"

let randomizerState = "increasing" // decreasing

for (let soundtrackItem in soundtrackNames) {
	const newButton = document.createElement("button")
	newButton.type = "button"
	newButton.className = "buttonLong"
	newButton.value = soundtrackItem
	newButton.onclick = function () {
		soundtrackMenu.style.display = "none"
		loadSoundTrack(this.value)
	}
	newButton.innerHTML = soundtrackNames[soundtrackItem][1]
	soundtrackMenu.appendChild(newButton)
}

applySoundtrack(soundtrack)

function playUISound(value, ignore) {
	const baseAudio = document.querySelector("#audio_" + soundtrackLayers[soundtrack][0])
	if (ignore || baseAudio.currentTime == 0 || baseAudio.paused || baseAudio.ended) {
		sound_UI[value].currentTime = 0
		sound_UI[value].play()
	}
}

function toggleMenu() {
	if (soundtrackMenu.style.display == "inline-flex") {
		soundtrackMenu.style.display = "none"
		playUISound("Metal3")
	} else {
		soundtrackMenu.style.display = "inline-flex"
		playUISound("Metal1")
	}
}

function allLayers(action, value) {
	for (let layer of soundtrackLayers[soundtrack]) {
		const audio = document.querySelector("#audio_" + layer)
		switch (action) {
			case "play":
				audio.play()
				break
			case "pause":
				audio.pause()
				break
			case "stop":
				audio.pause()
			case "set":
				audio.currentTime = value
				break
			case "loop":
				audio.loop = value
				break
		}
	}
}

function loadSoundTrack(value) {
	transitionEffect.style.zIndex = 1
	transitionEffect.style.backgroundColor = "black"
	playUISound("Arp", true)
	setTimeout(function () {
		applySoundtrack(value, true)
		transitionEffect.style.backgroundColor = "transparent"
		transitionEffect.style.zIndex = -1
	}, 500)
}

function applySoundtrack(value, onPurpose) {
	soundtrack = value

	let children = layerSection.children
	if (children) {
		for (let i = children.length - 1; i >= 0; i--) {
			children[i].remove()
		}
	}

	switch (soundtrackLayers[soundtrack].length) {
		case 5:
		case 6:
			layerSection.style.width = "27rem"
			break
		case 9:
		case 10:
			layerSection.style.width = "35rem"
			break
		default:
			layerSection.style.width = "34rem"
	}

	if (onPurpose) {
		playToggle.value = false
		pauseToggle.value = false
		loopToggle.value = false
		randomizerToggle.value = false
	}

	soundtrackTitle.innerHTML = soundtrackNames[soundtrack][0]
	soundtrackName.innerHTML = `~ ${soundtrackNames[soundtrack][1]} ~`
	background.style.backgroundImage = `url('backgrounds/landscape - ${soundtrack.toLowerCase()} - flat.png')`

	for (let layer of soundtrackLayers[soundtrack]) {
		const newAudio = document.createElement("audio")
		newAudio.src = `music/${soundtrackNames[soundtrack][0]} (${soundtrack})/TH_${soundtrack} - ${layer}.wav`
		newAudio.id = "audio_" + layer
		newAudio.volume = 0
		layerSection.appendChild(newAudio)

		const newButton = document.createElement("button")
		newButton.type = "button"
		newButton.id = "switch_" + layer
		newButton.className = "buttonToggle"
		newButton.value = false
		newButton.onclick = function () {
			toggleLayer(this)
		}
		newButton.innerHTML = layer
		layerSection.appendChild(newButton)
	}

	const baseAudio = document.querySelector("#audio_" + soundtrackLayers[soundtrack][0])

	baseAudio.addEventListener("timeupdate", function () {
		if (this.loop && this.currentTime > this.duration - 0.35) {
			if (randomizerState == "next" && randomizerToggle.value == "true") {
				randomizerState = "increasing"
				transitionEffect.style.zIndex = 1
				transitionEffect.style.backgroundColor = "black"
				setTimeout(function () {
					applySoundtrack(Object.keys(soundtrackNames)[Math.floor(Math.random() * Object.keys(soundtrackNames).length)], false)
					transitionEffect.style.backgroundColor = "transparent"
					transitionEffect.style.zIndex = -1
					allLayers("play")
					allLayers("loop", true)
					randomizer(2)
				}, 500)
			} else {
				setTimeout(function () {
					allLayers("set", 0)
					if (randomizerToggle.value == "true") {
						randomizer()
					}
				}, (this.duration - 0.06 - this.currentTime) * 1000)
			}
		}
	})

	baseAudio.addEventListener("ended", function () {
		playToggle.value = false
	})
}

function playAll() {
	playToggle.value = true
	pauseToggle.value = false
	allLayers("play")
}
function pauseAll() {
	playUISound("Metal1", true)
	playToggle.value = false
	pauseToggle.value = true
	allLayers("pause")
}
function reset() {
	playUISound("Metal3", true)
	playToggle.value = false
	pauseToggle.value = false
	loopToggle.value = false
	randomizerToggle.value = false
	allLayers("stop", 0)
	allLayers("loop", false)
	for (let layer of soundtrackLayers[soundtrack]) {
		document.getElementById("switch_" + layer).value = false
		document.getElementById("audio_" + layer).volume = 0
	}
}
function resync() {
	playUISound("Metal1")
	let baseTime = document.querySelector("#audio_" + soundtrackLayers[soundtrack][0]).currentTime
	for (let layer of soundtrackLayers[soundtrack]) {
		document.querySelector("#audio_" + layer).currentTime = baseTime
	}
}
function toggleLoop(checked) {
	playUISound("Metal1")
	checked = checked != `true`
	loopToggle.value = checked
	allLayers("loop", checked)
}
function toggleRandomizer(checked) {
	playUISound("Metal1")
	checked = checked != `true`
	randomizerToggle.value = checked
}

function toggleLayer(element) {
	let checked = element.value != `true`
	element.value = checked
	document.getElementById("audio_" + element.id.slice(7)).volume = checked ? 1 : 0
}

/* To debug loop function */
/*
function jump() {
	let baseTime = document.querySelector("#audio_" + soundtrackLayers[soundtrack][0]).duration - 1
	allLayers("set", baseTime)
}
*/

function randomizer(value) {
	/*
	let layersLength = soundtrackLayers[soundtrack].length
	
	let selectedMax = 0
	if (layersLength % 2 == 0) {
		selectedMax = layersLength / 2
	} else {
		selectedMax = (layersLength - 1) / 2
	}

	let selectedNumb = Math.floor(Math.random() * selectedMax) + 2
	console.log("selectedNumb: " + selectedNumb)
	*/

	let activeLayers = []
	let inactiveLayers = []
	for (let layer of soundtrackLayers[soundtrack]) {
		let audio = document.getElementById("audio_" + layer)
		if (audio.volume == 1) {
			activeLayers.push(layer)
		} else {
			inactiveLayers.push(layer)
		}
	}

	if (activeLayers.length <= 2) {
		randomizerState = "increasing"
	} else if (inactiveLayers.length == 0) {
		randomizerState = "decreasing"
	}

	let selectedNumb = Math.floor(Math.random() * 3) + 1
	if (value) selectedNumb = value
	console.log("selectedNumb: " + selectedNumb)
	let iteratedLayers = []

	while (iteratedLayers.length < selectedNumb) {
		let toggleCondition = iteratedLayers.length < 2 //increasing
		if (randomizerState == "decreasing") {
			toggleCondition = iteratedLayers.length > 1
		}

		let onlyIteratedInactive = iteratedLayers.sort().join(",") === inactiveLayers.sort().join(",")
		let onlyIteratedActive = iteratedLayers.sort().join(",") === activeLayers.sort().join(",")

		if (toggleCondition) {
			// Activate Layer
			if (inactiveLayers.length == 0) {
				console.log("inactiveLayers length = 0")
				break
			}
			if (onlyIteratedInactive) {
				console.log("onlyIteratedInactive")
				break
			}

			let selectedOrder = Math.floor(Math.random() * inactiveLayers.length)
			let layer = inactiveLayers[selectedOrder]
			if (iteratedLayers.includes(layer)) {
				console.log("iteratedLayers includes " + layer)
				continue
			}

			document.getElementById("audio_" + layer).volume = 1
			document.getElementById("switch_" + layer).value = true

			inactiveLayers = inactiveLayers.filter((item) => item != layer)
			activeLayers.push(layer)
			iteratedLayers.push(layer)

			console.log("enabled " + layer)
		} else {
			// Deactivate Layer
			if (activeLayers.length == 0) {
				console.log("activeLayers length = 0")
				break
			}
			if (onlyIteratedActive) {
				console.log("onlyIteratedActive")
				break
			}

			let selectedOrder = Math.floor(Math.random() * activeLayers.length)
			let layer = activeLayers[selectedOrder]
			if (iteratedLayers.includes(layer)) {
				console.log("iteratedLayers includes " + layer)
				continue
			}

			document.getElementById("audio_" + layer).volume = 0
			document.getElementById("switch_" + layer).value = false

			activeLayers = activeLayers.filter((item) => item != layer)
			inactiveLayers.push(layer)
			iteratedLayers.push(layer)

			console.log("disabled " + layer)
		}

		if (randomizerState == "decreasing" && activeLayers.length <= 2) {
			randomizerState = "next"
			break
		} else if (inactiveLayers.length == 0) {
			randomizerState = "decreasing"
			break
		}
	}

	console.log("iteratedLayers: " + iteratedLayers)
	console.log("activeLayers: " + activeLayers)
	console.log("inactiveLayers: " + inactiveLayers)
	console.log("randomizerState: " + randomizerState)
	console.log("----------")
}
