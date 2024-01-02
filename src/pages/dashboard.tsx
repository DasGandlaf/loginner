import Head from "next/head";

import {SignOutButton, useUser} from "@clerk/nextjs";
import {api} from "~/utils/api";
import {useEffect, useMemo, useRef, useState} from "react";
import {useRouter} from "next/router";
import {Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {spot} from "~/pages/_app";

dayjs.extend(relativeTime)

export function OnboardFourth() {
  spot(document.getElementById("payout-details")!)

  return (
    <div className="flex column gap-1">
      <h2><span className="secondary">9135$</span> is being paid out to you.</h2>
      <h5>Just sit back and relax until the Jan, 07, 2024! 😎👌</h5>
    </div
    >)
}

export function OnboardThird() {
  spot(document.getElementById("balance-details")!)

  return (
    <div className="flex column gap-1">
      <h2>You currently have <span className="secondary">435$</span> available for pay out.</h2>
      <h5>This is the money you can currently redeem!</h5>
    </div
    >)
}

export function OnboardSecond() {
  spot(document.getElementById("total-money")!)

  return (<div className="flex column gap-1">
    <h2>This is the total money you have on this account.</h2>
    <h5>Good job!</h5>
  </div>)
}

export function OnboardFirst() {

  return (
    <>
      <div className="flex justify-center">
        <h1>Hi!</h1>
        <h1>👋</h1>
      </div>
      <h3 className="mt4">Enjoying your awesome money making journey?</h3>
      <h4 className="mt2">Let's improve it.</h4>
    </>
  )
}

export function Onboarder() {
  const ctx = api.useUtils()
  const {mutate: checkOnboard} = api.post.checkOnboard.useMutation({
    onSuccess: () => invalidateOnboard()
  })
  const {mutate: updateOnboard} = api.post.setOnboard.useMutation({
    onSuccess: () => invalidateOnboard()
  })
  const onboarded = api.get.getOnboard.useQuery()
  const [page, setPage] = useState(0)
  const [pageAnim, setPageAnim] = useState("fade-right")

  const checked = useRef(false)

  useEffect(() => {
    if (!checked.current) {
      checkOnboard()
      checked.current = true;
    }
  }, [])

  const pageCount = 4

  function invalidateOnboard() {
    void ctx.get.getOnboard.invalidate().then(() => {
      spot(undefined)
    });
  }

  function updatePage(plus: number) {
    const sum = page + plus
    if (sum >= 0) {
      if (sum >= pageCount) {
        updateOnboard({state: true})
        return
      }

      setPage(sum)
      setPageAnim("")
      requestAnimationFrame(() => {
        setPageAnim(plus > 0 ? "fade-right" : "fade-left")
      })
    }
  }

  const pages = [OnboardFirst, OnboardSecond, OnboardThird, OnboardFourth]
  const show = onboarded?.data?.finished != null ? !onboarded?.data?.finished ?? false : false

  if (!show) {
    return (
      <div className="fade-right w-100">
        <button
          className={"bg-secondary w-100"} onClick={() => {
          setPage(0);
          updateOnboard({state: false})
        }}
        >Repeat Onboarding
        </button>
      </div>
    )
  }

  return (
    <>
      {
        show &&
        <div
          className={`absolute-center z-2`}
          style={{height: 500, width: 500}}
        >
          <div
            className={`fade-top flex column items-center h-100 w-100 bg-black b--solid br1 b--white tc pa5 pt4`}
          >
            <div className="points mb4">
              <div className={`${page === 0 && 'select'}`}></div>
              <div className={`${page === 1 && 'select'}`}></div>
              <div className={`${page === 2 && 'select'}`}></div>
              <div className={`${page === 3 && 'select'}`}></div>
            </div>
            <div className={`${pageAnim} to-fade`}>
              {pages[page]?.()}
            </div>

            <div className="flex justify-center mt-auto w-100">
              <button className="bg-primary-variant" onClick={() => updatePage(1)}>
                {page === pageCount - 1 ? 'Finish 🎉' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

function Graph(p: { fill: boolean, days: number, axis: boolean }) {
  const [graphData, setGraphData] = useState<unknown[]>([])

  useMemo(() => {
    const data: unknown[] = [];
    for (let i = p.days; i >= 1; --i) {
      const date = new Date();
      date.setTime(date.getTime() - 24 * 60 * 60 * 1000 * i)

      data.push({
        date: dayjs(date).format("MMM DD"),
        money: 50 + Math.random() * 100
      })
    }

    setGraphData(data)
  }, [])

  return <ResponsiveContainer width="100%" height="100%" className={"fade pa2"}>
    <AreaChart data={graphData}>
      <defs>
        <linearGradient id="gradient" x1={0} y1={0} x2={0} y2={1}>
          <stop offset={"20%"} stopColor="var(--primary-variant)"></stop>
          <stop offset={"70%"} stopColor="black"></stop>
        </linearGradient>
      </defs>

      {p.axis && <>
        <XAxis
          dataKey={"date"} fontStyle={3} interval={5}
          tickMargin={10}
          tick={{fontSize: ".5rem"}}
        />

        <YAxis
          dataKey={"money"} tickFormatter={(number) => "$" + number.toFixed(2)}
          width={40}
          tick={{fontSize: ".5rem"}}
        />
      </>
      }
      <Area
        dataKey="money" fill={`${p.fill && 'url(#gradient)'}`} strokeWidth={1} stroke="white" animationDuration={0}
        className={"size-y-0-100-from-bottom"}
        type={"natural"}
      ></Area>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      <Tooltip content={(props) => <ChartTooltip {...(props as any)} />}/>
    </AreaChart>
  </ResponsiveContainer>
}

function ChartTooltip({active, payload, label}: {
  active?: boolean,
  payload?: [{ value: number, payload: any }],
  label?: string
}) {
  if (!active || !payload)
    return null

  return (
    <div className="my-border bg-black pa3">
      <p>{payload[0]?.payload?.date!}</p>
      <p><span className="gray f6">Money:</span> <span className="secondary">${payload[0]?.value?.toFixed(2)}</span>
      </p>
    </div>
  )
}

function Nav() {
  const [toggle, setToggle] = useState(false)

  return (
    <>
      <div className="dn-l" style={{width: 64}}></div>
      <nav className="flex column bb-0 bt-0 bl-0 b--solid b--white bw0-1 nav h-100-m">
        <div
          className={`flex column dn-l pa3 pointer anim-click burger-menu ${toggle && 'active'}`}
          style={{gap: 7, width: 64}} onClick={() => {
          setToggle(!toggle)
        }}
        >
          <div className="w2" style={{borderTop: "1px solid white"}}></div>
          <div className="w2" style={{borderTop: "1px solid white"}}></div>
          <div className="w2" style={{borderTop: "1px solid white"}}></div>
        </div>
        <div className={`w5 pa2 flex column h-100 menu ${!toggle && 'hidden'}`}>
          <h1 className={"justify-start fade-right"}>Loginner</h1>
          <div className="mt-auto flex column gap-0-5">
            <SignOutButton>
              <div className="fade-right grow-1 flex">
                <button className={"bg-error grow-1"}>Sign Out</button>
              </div>
            </SignOutButton>
            <Onboarder/>
          </div>
        </div>
      </nav>
    </>
  )
}

export default function Home() {
  const user = useUser()
  const router = useRouter()

  useEffect(() => {
    if (user.isSignedIn === false) {
      void router.push("/")
    }
  }, [user.isSignedIn])

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <main className="flex column min-vh-100 items-center white gap-0-5">

        <div className="flex w-100 h-100 grow-1">

          <Nav/>

          <div className="flex column w-100 pa2 gap-0-5">
            <div className="flex grow-1 gap-0-5 column flex-row-l">
              <div className="flex grow-1 column gap-0-5">
                <div className="flex gap-0-5 column flex-row-l">
                  <div className="my-border w-50-l h4 pa3 flex column gap-1 justify-center">
                    <div className="flex w-100 justify-between">
                      <h1 id="total-money">$1847</h1>
                      <Graph fill={false} days={3} axis={false}></Graph>
                      <div className="bg-error flex items-center f6 ph2 h2">-32.4%</div>
                    </div>
                    <h4>Total</h4>
                  </div>
                  <div className="my-border w-50-l h4 pa3 flex row items-center">
                    <div className="flex column gap-1">
                      <h1>$961</h1>
                      <h4>Last Month</h4>
                    </div>

                    <div className="flex grow-1 h-75">
                      <Graph fill={false} days={30} axis={false}></Graph>
                    </div>
                  </div>
                </div>

                <div className="grow-1 flex my-border" id="main-graph">
                  <Graph fill={true} days={30} axis={true}></Graph>
                </div>
              </div>

              <div className="flex my-border column pa1 tc gap-1" style={{flexBasis: "20rem"}}>
                <div className="pa3 tl" id="balance-details">
                  <div className="flex justify-between"><h3>Balance</h3>
                    <button className="f6 bg-secondary">Details</button>
                  </div>
                  <p>427$</p>
                  <p className="mt3 gray f6">Available to pay out</p>
                </div>

                <div className="pa3 tl" id="payout-details">
                  <div className="flex justify-between"><h3>Payouts</h3>
                    <button className="f6 bg-secondary">Details</button>
                  </div>
                  <p>9238$</p>
                  <p className="mt3 gray f6">Arriving on Jan, 07, 2024</p>
                </div>
              </div>

            </div>

          </div>
        </div>
      </main>
    </>
  );
}
