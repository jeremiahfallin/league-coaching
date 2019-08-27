import React, { useState, useEffect } from "react"
import styled from "styled-components"

const Row = styled.div`
  display: flex;
  flex-direction: row;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const Box = styled.div`
  flex: 1;
  margin: 4px;
`

function PlayerInfo({ playerData, setPlayerData, position }) {
  const {
    summonerName,
    champion,
    role,
    kills,
    deaths,
    assists,
    damage,
    gold,
  } = playerData[position]

  const handlePlayerDataChange = e => {
    const { name, value } = e.target

    setPlayerData({
      ...playerData,
      [position]: { ...playerData[position], [name]: value },
    })
  }

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
        <InfoBox
          title={"Champion"}
          type={"text"}
          name={"champion"}
          value={champion}
          handler={handlePlayerDataChange}
        />
        <InfoBox
          title={"Role"}
          type={"text"}
          name={"role"}
          value={role}
          handler={handlePlayerDataChange}
        />
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
  )
}

const InfoBox = ({ title, type, name, value, handler }) => {
  return (
    <Box>
      <label htmlFor={name}>
        {title}
        <input
          type={type}
          id={name}
          name={name}
          placeholder={title}
          value={value}
          onChange={e => handler(e)}
        />
      </label>
    </Box>
  )
}

export default PlayerInfo
