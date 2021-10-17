const { oneMonthOld, checkDatabase, thirtyDaysInMilliseconds, oneHourInMilliseconds, formatChannelName } = require("./index.js")

const index = require("./index")
const oldDate = Date.now() - thirtyDaysInMilliseconds - thirtyDaysInMilliseconds
const oneMonthAndOneHourAgo = Date.now() - thirtyDaysInMilliseconds + oneHourInMilliseconds
const oneMonthLessThirtyMinutesAgo = Date.now() - thirtyDaysInMilliseconds - (oneHourInMilliseconds/2)
const oneMonthAgo = Date.now() - thirtyDaysInMilliseconds
const dateNow = Date.now()
const futureDate = Date.now() + thirtyDaysInMilliseconds + thirtyDaysInMilliseconds

console.log(oldDate, oneMonthAndOneHourAgo, oneMonthLessThirtyMinutesAgo, oneMonthAgo, dateNow, futureDate)

test('one month old(very old date) === false', () => {
  expect(oneMonthOld(oldDate)).toBe(false)
})

test('one month old(oneMonthAndOneHourAgo) === false', () => {
  expect(oneMonthOld(oneMonthAndOneHourAgo)).toBe(false)
})

test('one month old(oneMonthLessThirtyMinutesAgo) === true', () => {
  expect(oneMonthOld(oneMonthLessThirtyMinutesAgo)).toBe(true)
})

test('one month old(oneMonthAgo) === true', () => {
  expect(oneMonthOld(oneMonthAgo)).toBe(true)
})

test('one month old(dateNow) === false', () => {
  expect(oneMonthOld(dateNow)).toBe(false)
})

test('one month old(futureDate) === false', () => {
  expect(oneMonthOld(futureDate)).toBe(false)
})

test('formatChannelName returns correct name', () => {
  expect(formatChannelName('#bandswithlegends')).toBe('bandswithlegends')
})

test('formatChannelName returns correct name', () => {
  expect(formatChannelName('bandswithlegends')).toBe('bandswithlegends')
})

test('formatChannelName returns correct name', () => {
  expect(formatChannelName('##bandswithlegends')).toBe('#bandswithlegends')
})

// @ponicode
describe("index.oneMonthOld", () => {
    test("0", () => {
        let callFunction = () => {
            index.oneMonthOld(0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            index.oneMonthOld(1)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            index.oneMonthOld(0.0)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            index.oneMonthOld("bar")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            index.oneMonthOld(-10)
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            index.oneMonthOld(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.formatChannelName", () => {
    test("0", () => {
        let callFunction = () => {
            index.formatChannelName("George")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("1", () => {
        let callFunction = () => {
            index.formatChannelName("Anas")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("2", () => {
        let callFunction = () => {
            index.formatChannelName("Michael")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("3", () => {
        let callFunction = () => {
            index.formatChannelName("Pierre Edouard")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("4", () => {
        let callFunction = () => {
            index.formatChannelName("Jean-Philippe")
        }
    
        expect(callFunction).not.toThrow()
    })

    test("5", () => {
        let callFunction = () => {
            index.formatChannelName(undefined)
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.checkDatabase", () => {
    test("0", () => {
        let callFunction = () => {
            index.checkDatabase()
        }
    
        expect(callFunction).not.toThrow()
    })
})

// @ponicode
describe("index.checkForMessages", () => {
    test("0", () => {
        let callFunction = () => {
            index.checkForMessages()
        }
    
        expect(callFunction).not.toThrow()
    })
})
