<h1>Hover Connect</h1>

<div class="container">
  <div class="centered">Text One</div>
  <div class="centered">Text Two</div>
  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Esse in, provident reprehenderit earum dignissimos unde eligendi qui rerum atque fuga quia delectus excepturi accusamus necessitatibus distinctio sed vel amet! Sed doloremque architecto fugit atque natus adipisci. Dicta modi vel eveniet eos aliquam facilis velit itaque alias maxime quos sed blanditiis, magnam architecto aperiam aut ducimus perspiciatis qui adipisci obcaecati ullam officiis sint fugiat? Iste obcaecati nam deserunt! Ipsam necessitatibus obcaecati maiores in natus eos ducimus vero placeat corporis soluta temporibus minima itaque mollitia ex aut quaerat maxime atque repellat, eaque odio tenetur dolores totam harum non. Minima quidem ad nobis!</p>
</div>

<style>
  .container {
    display: flex;
    gap: 1rem;
  }

  .centered {
	position: relative;
	padding-left: 2rem;
	padding-right: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 200px;
    width: 200px;
    border: 1px solid black;
    box-sizing: border-box; /* Ensures consistent sizing */
    transition: transform 0.5s ease; /* Smooth scale transition */
  }

  .container:hover .centered {
	border: 1px solid transparent;
  }

  .centered::after {
    content: '';
    position: absolute;
    inset: 0;
    border: 15px solid transparent;
    transition: border-color 0.5s ease;
  }

  .container:hover .centered::after {
    border-color: lightgrey;
  }

  .container:hover .centered {
    cursor: pointer;
    transform: scale(1.05); /* Optional for a subtle hover scaling effect */
  }
</style>
