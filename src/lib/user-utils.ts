
type Username = {
  firstName: string;
  middleName: string | null;
  lastName: string;
}

type Location = {
  city: string;
  country: string;
}

export function getUserNames(data: string): Username{
  const fullname = data.split(" ") || [];

  const firstName = fullname[0] || "";
  const middleName = fullname.length > 2 ? fullname[1] : "-";
  const lastName = fullname.length > 2 ? fullname[2] : fullname[1];

  return {
    firstName,
    middleName,
    lastName,
  };
}

export function splitLocation(data: string): Location {
  const location = data.split(", ") || [];

  const city = location[0] || "";
  const country = location[1] || "";

  return {
    city,
    country,
  };
}
