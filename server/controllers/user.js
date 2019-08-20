const { message, errors, jwtGenerate, hash, constant, formatDate } = require('server/utils')
const userRepository = require('../repositories/user')

const create = async (ctx, next) => {
  try {
    const token = jwtGenerate(ctx.payload.user.email)
    const user = await userRepository.create(ctx, token)

    if (user[1]) {
      delete user[0].dataValues.password
      ctx.payload.user = user[0]
      ctx.payload.user.dataValues.token = token
      ctx.payload.user.dataValues.geolocation = {
        type: 'Point',
        coordinates: [
          ctx.payload.user.dataValues.lat,
          ctx.payload.user.dataValues.lng
        ]
      }
      delete ctx.payload.user.dataValues.lat
      delete ctx.payload.user.dataValues.lng
      formatFieldDate(ctx.payload.user.dataValues)

      await next()
    } else {
      return errors.badRequest(ctx, message.emailAlreadyExists)
    }
  } catch (err) {
    return errors.InternalServerError(ctx, err)
  }
}

const list = async ctx => {
  const response = await userRepository.findAll()

  ctx.body = response
}

const signIn = async (ctx, next) => {
  try {
    const user = await userRepository.findOne(ctx)

    if (!user) {
      return errors.notAcceptable(ctx, message.invalidUser)
    } else if (user && hash.compare(ctx.payload.password, user.password)) {
      const payload = await userRepository.update(user.id, user.guid)
      user.dataValues.lastLogin = payload.lastLogin
      user.dataValues.token = payload.token
      delete user.dataValues.id
      delete user.dataValues.password

      formatFieldDate(user.dataValues)

      ctx.status = 200
      ctx.body = user
    } else {
      return errors.unauthorized(ctx, message.invalidUser)
    }
  } catch (err) {
    return errors.InternalServerError(ctx, err)
  }
}

const search = async (ctx, next) => {
  try {
    const user = await userRepository.findOne(ctx)
    delete user.dataValues.id

    if (user && hash.compare(ctx.headers.authentication, user.token)) {
      if ((Date.now() - user.dataValues.createdAt.valueOf())/constant.msInMinute < constant.limLastLogin) {
        formatFieldDate(user.dataValues)
        
        ctx.status = 200
        ctx.body = user
      } else {
        return errors.unauthorized(ctx, message.invalidSession)
      }
    } else {
      return errors.unauthorized(ctx, message.unauthorized)
    }
  } catch (err) {
    return errors.InternalServerError(ctx, err)
  }
}

const formatFieldDate = (user) => {
  user.createdAt = formatDate(user.createdAt)
  user.updatedAt = formatDate(user.updatedAt)
  user.lastLogin = formatDate(user.lastLogin)
}

module.exports = {
  create,
  signIn,
  search,
  list
}