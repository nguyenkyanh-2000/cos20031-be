import { applyDecorators, HttpStatus, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ResponseMessage } from './response-message.decorators';

/**
 * Decorator that defines a standard API error response schema for a given HTTP status code.
 *
 * @param statusCode - The HTTP status code for the error response.
 * @param description - A brief description of the error.
 * @param options - Optional additional options for the API response.
 * @returns A decorator function that applies the specified API response schema.
 *
 * The generated schema includes:
 * - `statusCode`: The HTTP status code.
 * - `error`: The HTTP status code message.
 * - `message`: A string describing the error message.
 */

export function ApiErrorResponse(
  statusCode: HttpStatus,
  description: string,
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    ApiResponse({
      ...options,
      status: statusCode,
      description,
      schema: {
        default: {
          statusCode,
          message: description,
          error: HttpStatus[statusCode],
        },
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'number' },
          error: { type: 'string' },
        },
      },
    }),
  );
}

/**
 * Decorator that defines a standard API response schema for a POST request.
 *
 * @template TModel - The type of the model for the response.
 * @param model - The class type of the model.
 * @param message - An optional message describing the successful creation of the model. Defaults to `${model.name} created successfully`.
 * @returns A decorator function that applies the specified API response schema.
 *
 * The generated schema includes:
 * - `data`: The created model instance.
 */
export const ApiPostResponse = <TModel extends Type<any>>(
  model: TModel,
  message: string,
) => {
  return applyDecorators(
    ResponseMessage(message),
    ApiExtraModels(model),
    ApiCreatedResponse({
      schema: {
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'number', default: HttpStatus.CREATED },
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );
};

export const ApiGetResponse = <TModel extends Type<any>>(
  model: TModel,
  message: string,
) => {
  return applyDecorators(
    ResponseMessage(message),
    ApiExtraModels(model),
    ApiOkResponse({
      schema: {
        properties: {
          message: { type: 'string' },
          statusCode: { type: 'number', default: HttpStatus.OK },
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    }),
  );
};
