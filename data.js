import * as api from "./api.js";

const host = "http://localhost:3030";
api.settings.host = host;

export const login = api.login;
export const register = api.register;
export const logout = api.logout;

// Application-specific request
// get all listings
export async function getAllPets() {
  return await api.get(
    host + "/data/pets?sortBy=_createdOn%20desc&distinct=name"
  );
}

// get listing by id
export async function getPetById(id) {
  return await api.get(host + `/data/pets/${id}`);
}

// create listing
export async function addPet(pet) {
  return await api.post(host + "/data/pets", pet);
}

// edit listing by id
export async function editPetById(id, pet) {
  return await api.put(host + `/data/pets/${id}`, pet);
}

// delete listing by id
export async function deletePetById(id) {
  return await api.del(host + `/data/pets/${id}`);
}

export async function donate(petId) {
  return await api.post(host + `/data/donation`, petId);
}

export async function getTotalDonations(petId) {
  return await api.get(
    host + `/data/donation?where=petId%3D%22${petId}%22&distinct=_ownerId&count`
  );
}

export async function didUserDonate(petId, userId) {
  return await api.get(
    host +
      `/data/donation?where=petId%3D%22${petId}%22%20and%20_ownerId%3D%22${userId}%22&count`
  );
}
