import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useStaticQuery, graphql } from "gatsby";

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Box = styled.div`
  flex: 1;
  margin: 4px;
`;

function PlayerInfo({ playerData, setPlayerData, position }) {
  const [championsArray, setChampionsArray] = useState([]);
  const champions = useStaticQuery(graphql`
    {
      allFile(filter: { extension: { eq: "png" } }) {
        edges {
          node {
            publicURL
            name
          }
        }
      }
    }
  `);

  const {
    summonerName,
    champion,
    role,
    kills,
    deaths,
    assists,
    damage,
    gold,
  } = playerData[position];

  const handlePlayerDataChange = e => {
    e.persist();
    const { name, value } = e.target;

    setPlayerData({
      ...playerData,
      [position]: { ...playerData[position], [name]: value },
    });
  };

  const handleChampionChange = e => {
    e.persist();
    const { value } = e.target;

    setPlayerData({
      ...playerData,
      [position]: { ...playerData[position], ["champion"]: value },
    });
  };

  const handleRoleChange = e => {
    e.persist();
    const { value } = e.target;

    setPlayerData({
      ...playerData,
      [position]: { ...playerData[position], ["role"]: value },
    });
  };

  useEffect(() => {
    let arr = [];
    champions.allFile.edges.map((file, index) => {
      arr.push(file.node.name);
    });
    arr.sort();
    setChampionsArray(arr);
  }, []);

  return (
    <Column>
      <InfoBox
        title={"Summoner Name"}
        type={"text"}
        name={"summonerName"}
        value={summonerName}
        handler={handlePlayerDataChange}
      />
      <Row>
        <Box>
          <label htmlFor={"Champion"}>
            {"Champion"}
            <select
              name={champion}
              value={champion}
              onChange={e => handleChampionChange(e)}
            >
              {championsArray.map((name, index) => {
                return (
                  <option key={index} value={name}>
                    {name}
                  </option>
                );
              })}
            </select>
          </label>
        </Box>
        <Box>
          <label htmlFor={"Role"}>
            {"Role"}
            <select
              name={role}
              value={role}
              onChange={e => handleRoleChange(e)}
            >
              <option value="top">Top</option>
              <option value="jungle">Jungle</option>
              <option value="mid">Mid</option>
              <option value="carry">Carry</option>
              <option value="support">Support</option>
            </select>
          </label>
        </Box>
      </Row>

      <Row>
        <InfoBox
          title={"K"}
          type={"number"}
          name={"kills"}
          value={kills}
          handler={handlePlayerDataChange}
        />
        <InfoBox
          title={"D"}
          type={"number"}
          name={"deaths"}
          value={deaths}
          handler={handlePlayerDataChange}
        />
        <InfoBox
          title={"A"}
          type={"number"}
          name={"assists"}
          value={assists}
          handler={handlePlayerDataChange}
        />
      </Row>
      <Row>
        <InfoBox
          title={"Damage"}
          type={"number"}
          name={"damage"}
          value={damage}
          handler={handlePlayerDataChange}
        />
        <InfoBox
          title={"Gold"}
          type={"number"}
          name={"gold"}
          value={gold}
          handler={handlePlayerDataChange}
        />
      </Row>
    </Column>
  );
}

const InfoBox = ({ title, type, name, value, handler }) => {
  return (
    <Box>
      <label htmlFor={name}>
        {title}
        <input
          type={type}
          required
          id={name}
          name={name}
          placeholder={title}
          value={value}
          onChange={e => handler(e)}
        />
      </label>
    </Box>
  );
};

export default PlayerInfo;
