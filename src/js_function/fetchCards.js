const BASE_CASE = "https://pixabay.com/api/?";
const API_KEY = "26014501-193a5d23d0126e5770d29076d";

export const fetchCards = async (name) => {
    const responce = await fetch(`${BASE_CASE}key=${API_KEY}&q=${name}
    &image_type=photo&orientation=horizontal&safesearch=true`);
    const cards = await responce.json();
    if (cards.total !== 0) {
        return cards;
    }
    throw new Error(console.log("Ошибка!"));
};