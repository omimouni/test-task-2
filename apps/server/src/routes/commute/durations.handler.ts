import { app, res } from '@/handler'
import { t, DurationsSchema } from '@schemas'
import { randomInt } from '~core/helpers'

//
const reqDTO = t.Object({
  addresses: t.Array(t.String(), { minItems: 1, maxItems: 2 }),
})

// response for multiple addresses
const resArrayDTO = t.Object({
  durations: t.Array(
    t.Object({
      address: t.String(),
      durations: DurationsSchema,
    }),
  ),
})

export const commuteDurationsEndpointHandler = app.post(
  '/durations',
  ({ body, res }) => {
    if (body.addresses.length === 0) {
      return res.badRequest('No addresses provided')
    }

    if (body.addresses.length > 2) {
      return res.badRequest('Maximum 2 addresses allowed')
    }

    // Create an array of durations for each address
    const durationsArray = body.addresses.map((address, index) => ({
      address,
      durations: {
        walking: randomInt(45, 90),
        biking: randomInt(25, 60),
        driving: randomInt(10, 30),
        transit: randomInt(10, 30),
      },
    }))

    return res.ok({
      durations: durationsArray,
    })
  },
  { body: reqDTO, response: res(resArrayDTO) },
)

// THIS FRAMEWORK IS TOO SIMPLE I LOVE IT.
