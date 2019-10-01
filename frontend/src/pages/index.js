import React from "react";
import { Link } from "gatsby";

import Image from "../components/image";
import SEO from "../components/seo";

const IndexPage = () => (
  <>
    <SEO title="Home" />
    <p>
      This website is a tool for recording and tracking stats of teams and
      players in amateur League of Legends tournaments/leagues.
    </p>
    <p>
      At the top, you can add a match with the Match ID of the game that was
      played. Using that will fill in all of the stats for the game. Afterward,
      you can either select a team name if they've already played matches that
      have been submitted, or you can manually type in and add a new one.
      Lastly, you'll fill out the players who were involved in the game.
    </p>
    <p>
      Clicking View Teams will allow you to look through the stats for the
      different teams who have had games stored here and also the players who
      have been on those teams.
    </p>
    <p>
      League Coaching isn’t endorsed by Riot Games and doesn’t reflect the views
      or opinions of Riot Games or anyone officially involved in producing or
      managing League of Legends. League of Legends and Riot Games are
      trademarks or registered trademarks of Riot Games, Inc. League of Legends
      © Riot Games, Inc.
    </p>
  </>
);

export default IndexPage;
