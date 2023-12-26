import { html } from "../../node_modules/lit-html/lit-html.js";
import {
  getPetById,
  deletePetById,
  donate,
  getTotalDonations,
  didUserDonate,
} from "../api/data.js";

const detailsTemplate = (
  pet,
  isOwner,
  onDelete,
  isLoggedIn,
  totalDonationCount,
  onClickDonate,
  didUserDonated
) => html`
  <section id="detailsPage">
    <div class="details">
      <div class="animalPic">
        <img src="${pet.image}" />
      </div>
      <div>
        <div class="animalInfo">
          <h1>Name: ${pet.name}</h1>
          <h3>Breed: ${pet.breed}</h3>
          <h4>Age: ${pet.age}</h4>
          <h4>Weight: ${pet.weight}</h4>
          <h4 class="donation">Donation: ${totalDonationCount}$</h4>
        </div>
        <!-- if there is no registered user, do not display div-->
        <div class="actionBtn">
          <!-- Only for registered user and creator of the pets-->
          ${isOwner
            ? html` <a href="/edit/${pet._id}" class="edit">Edit</a>
                <a href="javascript:void(0)" class="remove" @click=${onDelete}
                  >Delete</a
                >`
            : ""}
          <!--(Bonus Part) Only for no creator and user-->
          ${(() => {
            if (didUserDonated == 0) {
              if (isLoggedIn && !isOwner) {
                return html` <a
                  href="javascript:void(0)"
                  @click=${onClickDonate}
                  class="donate"
                  >Donate</a
                >`;
              }
            }
          })()}
        </div>
      </div>
    </div>
  </section>
`;

export async function detailsPage(ctx) {
  const petId = ctx.params.id;
  const pet = await getPetById(petId);
  const user = ctx.user;

  let userId;
  let totalDonationCount;
  let didUserDonated;

  if (user != null) {
    userId = user._id;
    didUserDonated = await didUserDonate(petId, userId);
  }

  const isOwner = user && pet._ownerId == user._id;
  const isLoggedIn = user !== undefined;

  totalDonationCount = await getTotalDonations(petId);
  ctx.render(
    detailsTemplate(
      pet,
      isOwner,
      onDelete,
      isLoggedIn,
      totalDonationCount,
      onClickDonate,
      didUserDonated
    )
  );

  async function onClickDonate() {
    const donation = {
      petId: petId,
    };
    await donate(donation);

    totalDonationCount = await getTotalDonations(petId);
    didUserDonated = await didUserDonate(petId, userId);
    ctx.render(
      detailsTemplate(
        pet,
        isOwner,
        onDelete,
        isLoggedIn,
        totalDonationCount,
        onClickDonate,
        didUserDonate
      )
    );
  }

  async function onDelete() {
    const confirmed = confirm("Are you sure?");
    if (confirmed) {
      await deletePetById(petId);
      ctx.page.redirect("/");
    }
  }
}
