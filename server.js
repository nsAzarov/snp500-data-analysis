import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import csv from 'csvtojson'
import { parseStringToDate } from './utils/index.js'

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const csvFilePath = './spdata.csv'
let data = []
const dataPer10Days = []

const avg200dataPerDay = []
const avg50dataPerDay = []

const avg200dataPerWeek = []
const avg50dataPerWeek = []

const buyPoints = []
const sellPoints = []

let cash = 1000
let indexFundPies = 0

const passiveAccountData = []
const passiveAccountDataPer10Days = []
const activeAccountData = []
const activeAccountDataPer10Days = []

const inCash = []

const finalResult = []

csv()
	.fromFile(csvFilePath)
	.then((jsonObj) => {
		jsonObj.forEach((rawData) => {
			data.push({
				date: rawData['Дата'],
				value: Number(rawData['Откр.'].replace('.', '').replace(',', '.')),
			})
		})
		data = data.reverse() // от 2000 к 2019

		fillDataPer10Days(data)

		fillAvg200dataPerDay(data)
		fillAvg50dataPerDay(data)

		fillAvg200dataPerWeek(dataPer10Days)
		fillAvg50dataPerWeek(dataPer10Days)

		findSalePoints(data)

		fillPassiveAccountData(data)
		fillPassiveAccountDataPer10Days(passiveAccountData)
		fillActiveAccountData(data)
		fillAccountDataPer10Days(activeAccountData)

		fillFinalResult(dataPer10Days)
	})

const fillDataPer10Days = (data) => {
	let sum = 0
	for (let i = 0; i < data.length; i++) {
		sum += data[i].value
		if (i > 0 && i % 10 === 0) {
			dataPer10Days.push({
				date: data[i].date,
				value: sum / 10,
			})
			sum = 0
		}
	}
}

const fillAvg200dataPerDay = (data) => {
	let sum200 = 0
	let avg200value = 0
	for (let i = 0; i < data.length; i++) {
		sum200 += data[i].value
		if (i >= 200) {
			sum200 -= data[i - 200].value
			avg200value = sum200 / 200
		}
		avg200dataPerDay.push({ date: data[i].date, value: avg200value })
	}
}

const fillAvg50dataPerDay = (data) => {
	let sum50 = 0
	let avg50value = 0
	for (let i = 0; i < data.length; i++) {
		sum50 += data[i].value
		if (i >= 50) {
			sum50 -= data[i - 50].value
			avg50value = sum50 / 50
		}
		avg50dataPerDay.push({ date: data[i].date, value: avg50value })
	}
}

const fillAvg200dataPerWeek = (data) => {
	let sum200 = 0
	let avg200value = 0
	for (let i = 0; i < data.length; i++) {
		sum200 += data[i].value
		if (i >= 20) {
			sum200 -= data[i - 20].value
			avg200value = sum200 / 20
		}
		avg200dataPerWeek.push({ date: data[i].date, value: avg200value })
	}
}

const fillAvg50dataPerWeek = (data) => {
	let sum50 = 0
	let avg50value = 0
	for (let i = 0; i < data.length; i++) {
		sum50 += data[i].value
		if (i >= 5) {
			sum50 -= data[i - 5].value
			avg50value = sum50 / 5
		}
		avg50dataPerWeek.push({ date: data[i].date, value: avg50value })
	}
}

const fillPassiveAccountData = (data) => {
	let indexFundPiesNumber = 0
	for (let i = 0; i < data.length; i++) {
		let piePrice = data[i].value / 10000
		if (
			parseStringToDate(data[i].date) >= new Date(2003, 4, 15) &&
			indexFundPiesNumber === 0
		) {
			indexFundPiesNumber = +(1000 / piePrice).toFixed(0)
		}
		passiveAccountData.push({
			date: data[i].date,
			value: indexFundPiesNumber * piePrice,
		})
	}
}

const fillActiveAccountData = (data) => {
	let currentCash = 1000
	let indexFundPiesNumber = 0
	for (let i = 0; i < data.length; i++) {
		let piePrice = data[i].value / 10000
		if (parseStringToDate(data[i].date) >= new Date(2003, 4, 15)) {
			if (inCash[i]) {
				currentCash =
					currentCash < 100
						? currentCash + piePrice * indexFundPiesNumber
						: currentCash
				indexFundPiesNumber = 0
				activeAccountData.push({
					date: data[i].date,
					value: currentCash,
				})
			} else if (indexFundPiesNumber === 0) {
				indexFundPiesNumber = +(currentCash / piePrice).toFixed(0)
				currentCash = currentCash - indexFundPiesNumber * piePrice
				activeAccountData.push({
					date: data[i].date,
					value: indexFundPiesNumber * piePrice,
				})
			} else {
				activeAccountData.push({
					date: data[i].date,
					value: indexFundPiesNumber * piePrice,
				})
			}
		} else {
			activeAccountData.push({
				date: data[i].date,
				value: 0,
			})
		}
	}
}

const fillPassiveAccountDataPer10Days = (data) => {
	let sum = 0
	for (let i = 0; i < data.length; i++) {
		sum += data[i].value
		if (i > 0 && i % 10 === 0) {
			passiveAccountDataPer10Days.push({
				date: data[i].date,
				value: sum / 10,
			})
			sum = 0
		}
	}
}

const fillAccountDataPer10Days = (data) => {
	let sum = 0
	for (let i = 0; i < data.length; i++) {
		sum += data[i].value
		if (i > 0 && i % 10 === 0) {
			activeAccountDataPer10Days.push({
				date: data[i].date,
				value: sum / 10,
			})
			sum = 0
		}
	}
}

const findSalePoints = (data) => {
	let is50AvgLineAbove200
	for (let i = 0; i < data.length; i++) {
		if (avg50dataPerDay[i].value > avg200dataPerDay[i].value) {
			if (
				!is50AvgLineAbove200 &&
				parseStringToDate(data[i].date) >= new Date(2003, 4, 15) &&
				cash > 100
			) {
				console.log('buy', data[i])
				const piePrice = data[i].value / 10000
				indexFundPies = cash / piePrice
				cash = cash - indexFundPies * piePrice
				buyPoints.push(data[i])
			}
			is50AvgLineAbove200 = true
		}
		if (avg50dataPerDay[i].value < avg200dataPerDay[i].value) {
			if (
				is50AvgLineAbove200 &&
				parseStringToDate(data[i].date) >= new Date(2003, 4, 15) &&
				cash < 100
			) {
				console.log('sell', data[i])
				const piePrice = data[i].value / 10000
				cash = indexFundPies * piePrice
				indexFundPies = 0
				sellPoints.push(data[i])
			}
			is50AvgLineAbove200 = false
		}
		inCash.push(!is50AvgLineAbove200)
	}
}

const fillFinalResult = (data) => {
	for (let i = 0; i < data.length; i++) {
		finalResult.push({
			name: data[i].date,
			value: +data[i].value.toFixed(2),
			avg200value: +avg200dataPerWeek[i].value.toFixed(2),
			avg50value: +avg50dataPerWeek[i].value.toFixed(2),
			passiveAccountValue: +passiveAccountDataPer10Days[i].value.toFixed(2),
			activeAccountValue: +activeAccountDataPer10Days[i].value.toFixed(2),
		})
	}
}

app.get('/Data', (_, res) => {
	res.json(finalResult)
})

if (process.env.NODE_ENV === 'production') {
	app.use(express.static('client/build'))

	app.get('*', (_, res) => {
		res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
	})
}

const PORT = process.env.PORT || 4003
app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`))
