import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isCoordinates', async: false })
export class IsCoordinatesConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) {
      args.constraints[0] = 'location is required.';
      return false;
    }

    if (typeof value !== 'object') {
      args.constraints[0] = 'location must be an object.';
      return false;
    }

    const { coordinates, country } = value;

    if (!country) {
      args.constraints[0] = 'location.country is required';
      return false;
    }

    if (
      !coordinates ||
      !Array.isArray(coordinates) ||
      coordinates.length !== 2
    ) {
      args.constraints[0] = 'Coordinates array must have exactly 2 elements.';
      return false;
    }

    const [longitude, latitude] = coordinates;

    if (typeof longitude !== 'number') {
      args.constraints[0] = 'Invalid longitude. It must be a number.';
      return false;
    }

    if (typeof latitude !== 'number') {
      args.constraints[0] = 'Invalid latitude. It must be a number.';
      return false;
    }

    if (longitude < -180 || longitude > 180) {
      args.constraints[0] =
        'Invalid longitude. It must be between -180 and 180.';
      return false;
    }

    if (latitude < -90 || latitude > 90) {
      args.constraints[0] = 'Invalid latitude. It must be between -90 and 90.';
      return false;
    }

    return true;
  }

  defaultMessage(args: ValidationArguments) {
    return args.constraints[0];
  }
}

export function IsCoordinates(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isCoordinates',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: IsCoordinatesConstraint,
    });
  };
}
