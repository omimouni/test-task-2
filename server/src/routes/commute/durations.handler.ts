export const newCommuteDurationsEndpointHandler = app.post(
  '/durations',
  ({ body, res }) => {
    if (body.addresses.length === 0) {
      return res.error('No addresses provided', { status: 'error' })
    }

    if (body.addresses.length > 2) {
      return res.error('Maximum 2 addresses allowed', { status: 'error' })
    }

    // Create an array of durations for each address
    const durationsArray = body.addresses.map(() => ({
      walking: randomInt(45, 90),
      biking: randomInt(25, 60),
      driving: randomInt(10, 30),
      transit: randomInt(10, 30),
    }));

    return res.ok({
      durations: durationsArray,
    })
  },
  { body: reqDTO, response: res(res2DTO) },
) 