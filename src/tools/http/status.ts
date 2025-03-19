type Code = 200 | 201 | 400 | 401 | 404 | 413 | 422 | 500
type Status = { code: Code; text: string }

export const StatusOK: Status = {
  code: 200,
  text: "Ok",
}

export const StatusCreated: Status = {
  code: 201,
  text: "Created",
}

export const StatusBadRequest: Status = {
  code: 400,
  text: "Bad Request",
}

export const StatusUnauthorized: Status = {
  code: 401,
  text: "Unauthorized",
}

export const StatusNotFound: Status = {
  code: 404,
  text: "Not Found",
}

export const StatusRequestEntityTooLarge: Status = {
  code: 413,
  text: "Request Entity Too Large",
}

export const StatusUnprocessableEntity: Status = {
  code: 422,
  text: "Unprocessable Entity",
}

export const StatusInternalServerError: Status = {
  code: 500,
  text: "Internal Server Error",
}
