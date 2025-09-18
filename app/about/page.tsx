"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface TeamMember {
  name: string;
  role: string;
  photoUrl: string;
}

export default function About() {
  const imageRef = useRef<HTMLDivElement | null>(null);
  const teamRef = useRef<HTMLDivElement | null>(null);
  const [isClient, setIsClient] = useState(false);

  const teamMembers: TeamMember[] = [
    {
      name: "Nigel Armstrong",
      role: "Project Manager",
      photoUrl: "/images/lebron.png",
    },
    {
      name: "Jane Smith",
      role: "Lead Developer",
      photoUrl: "/images/shakespear.jpeg",
    },
    {
      name: "Alice Johnson",
      role: "UI/UX Designer",
      photoUrl: "/images/napoleon.jpg",
    },
    { name: "Bob Brown", role: "QA Engineer", photoUrl: "/images/adolf.jpeg" },
    
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    // Set initial states to prevent FOUC (Flash of Unstyled Content)
    gsap.set(imageRef.current, {
      x: -200,
      opacity: 0,
    });

    if (teamRef.current) {
      gsap.set(teamRef.current.children, {
        y: 100,
        opacity: 0,
      });
    }

    // Create a timeline for better control
    const tl = gsap.timeline();

    // Animate programming image
    tl.to(imageRef.current, {
      x: 0,
      opacity: 1,
      duration: 1,
      ease: "power2.out",
    });

    // Animate team members
    if (teamRef.current) {
      tl.to(
        teamRef.current.children,
        {
          y: 0,
          opacity: 1,
          stagger: 0.2,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.5"
      ); // Start 0.5 seconds before previous animation ends
    }

    // Cleanup function
    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [isClient]);

  // Don't render animations on server-side
  if (!isClient) {
    return (
      <div className="px-10 py-10 flex flex-col items-center justify-center">
        <div className="w-full bg-primary-default h-[400px] rounded-2xl px-4 py-2 flex">
          <div className="w-full">
            <h1 className="header1-bold text-primary-subtle">ABOUT US</h1>
            <p className="header2-regular text-white">
              โปรเจคนี้เป็นงานของรายวิชา 01418321 (System Analyst)
            </p>
          </div>
          <div className="flex justify-end py-3 opacity-0">
            <Image
              src="/images/programming.jpg"
              alt="pg"
              width={800}
              height={350}
              className="rounded-2xl"
            />
          </div>
        </div>
        <h2 className="header2-bold text-primary-lighter">Our Team</h2>
        <ChevronDown className="text-primary-lighter" />
        <div className="flex gap-4 mt-5">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="flex flex-col items-center bg-primary-subtle p-4 rounded-lg shadow-md opacity-0"
            >
              <img
                src={member.photoUrl}
                alt={member.name}
                className="w-50 h-50 rounded-full mb-4 object-cover"
              />
              <h3 className="header4-bold text-black">{member.name}</h3>
              <p className="body-regular text-primary-darker">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-10 py-10 flex flex-col items-center justify-center">
      <div className="w-full bg-primary-default h-[400px] rounded-2xl px-4 py-2 flex">
        <div className="w-full">
          <h1 className="header1-bold text-primary-subtle">ABOUT US</h1>
          <p className="header2-regular text-white">
            โปรเจคนี้เป็นงานของรายวิชา 01418321 (System Analyst)
          </p>
        </div>
        <div ref={imageRef} className="flex justify-end py-3">
          <Image
            src="/images/programming.jpg"
            alt="pg"
            width={800}
            height={350}
            className="rounded-2xl"
            priority
          />
        </div>
      </div>
      <h2 className="header2-bold text-primary-lighter">Our Team</h2>
      <ChevronDown className="text-primary-lighter" />
      <div ref={teamRef} className="flex gap-4 mt-5">
        {teamMembers.map((member) => (
          <div
            key={member.name}
            className="flex flex-col items-center bg-primary-subtle p-4 rounded-lg shadow-md"
          >
            <img
              src={member.photoUrl}
              alt={member.name}
              className="w-50 h-50 rounded-full mb-4 object-cover"
            />
            <h3 className="header4-bold text-black">{member.name}</h3>
            <p className="body-regular text-primary-darker">{member.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
